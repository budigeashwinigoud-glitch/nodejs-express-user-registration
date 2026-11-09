const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const dataFile = process.env.USER_STORE_PATH ||
    path.join(__dirname, "..", "data", "users.json");

let usersPromise;
let writes = Promise.resolve();

const loadUsers = () => {
    if (!usersPromise) {
        usersPromise = fs.readFile(dataFile, "utf8")
            .then((contents) => {
                const users = JSON.parse(contents);

                if (!Array.isArray(users)) {
                    throw new Error("User store must contain a JSON array");
                }

                return users;
            })
            .catch((err) => {
                if (err.code === "ENOENT") {
                    return [];
                }

                throw err;
            });
    }

    return usersPromise;
};

const saveUsers = async (users) => {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });

    const temporaryFile = `${dataFile}.${process.pid}.${randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(users, null, 2), {
        encoding: "utf8",
        mode: 0o600
    });
    await fs.rename(temporaryFile, dataFile);
};

const User = {
    findByEmail: (email, callback) => {
        loadUsers()
            .then((users) => {
                const normalizedEmail = email.toLowerCase();
                const matches = users.filter(
                    (user) => user.email.toLowerCase() === normalizedEmail
                );

                callback(null, matches);
            })
            .catch(callback);
    },

    create: (user, callback) => {
        const operation = writes.then(async () => {
            const users = await loadUsers();
            const normalizedEmail = user.email.toLowerCase();

            if (users.some(
                (existingUser) => existingUser.email.toLowerCase() === normalizedEmail
            )) {
                const err = new Error("Email already registered");
                err.code = "ER_DUP_ENTRY";
                throw err;
            }

            const id = users.reduce(
                (nextId, existingUser) => Math.max(nextId, existingUser.id + 1),
                1
            );
            const newUser = { id, ...user };

            await saveUsers([...users, newUser]);
            usersPromise = Promise.resolve([...users, newUser]);

            return { insertId: id };
        });

        writes = operation.catch(() => {});
        operation.then(
            (result) => callback(null, result),
            callback
        );
    }
};

module.exports = User;
