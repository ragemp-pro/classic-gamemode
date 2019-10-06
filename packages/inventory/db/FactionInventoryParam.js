module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("FactionInventoryParam", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                var value = this.getDataValue('value');
                if (!isNaN(value)) value = parseFloat(value);
                return value;
            }
        },
        itemId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return model;
};