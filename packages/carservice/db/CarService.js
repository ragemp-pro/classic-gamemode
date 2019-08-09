module.exports = (sequelize, DataTypes) => {

    const model = sequelize.define("CarService", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        bizId: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        x: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        y: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        z: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        radius: {
            type: DataTypes.FLOAT,
            defaultValue: 10,
            allowNull: false
        }
    }, { timestamps: false });


    return model;
};
