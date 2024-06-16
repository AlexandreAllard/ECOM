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
                    max: 320,
                },
            },
            role: {
                type: DataTypes.ENUM,
                values: ['admin', 'user', 'accountant'],
                defaultValue: 'user',
                allowNull: false
            },
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
        }
    });

    return User;
};
