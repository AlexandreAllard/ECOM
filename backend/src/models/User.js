const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
    class User extends Model {
        async checkPassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            firstname: DataTypes.STRING(45),
            lastname: DataTypes.STRING(45),
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                    max: 320,
                },
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isLongEnough(value) {
                        if (value.length < 12) {
                            throw new Error("Le mot de passe doit contenir au moins 12 caractères.");
                        }
                    },
                    hasSymbols(value) {
                        if (!/[!@#$%^&*(),.?":{}|<>]/g.test(value)) {
                            throw new Error("Le mot de passe doit contenir des symboles.");
                        }
                    },
                    hasNumber(value) {
                        if (!/\d/g.test(value)) {
                            throw new Error("Le mot de passe doit contenir des chiffres.");
                        }
                    },
                    hasUpper(value) {
                        if (!/[A-Z]/g.test(value)) {
                            throw new Error("Le mot de passe doit contenir des majuscules.");
                        }
                    },
                    hasLower(value) {
                        if (!/[a-z]/g.test(value)) {
                            throw new Error("Le mot de passe doit contenir des minuscules.");
                        }
                    },
                },
            },
            role: {
                type: DataTypes.ENUM,
                values: ['admin', 'user', 'accountant', 'storekeeper'],
                defaultValue: 'user',
                allowNull: false
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            loginAttempts: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            lockUntil: {
                type: DataTypes.DATE,
            },
            lastPasswordChange: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: "user",
        }
    );

    User.addHook("beforeSave", async function (user) {
        if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            user.lastPasswordChange = new Date();
        }
    });

    return User;
};
