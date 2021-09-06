const { Sequelize } = require("sequelize");
//
// const sequelize = new Sequelize("geniusparkle", "root", "", {
// 	host: "localhost",
// 	dialect: "mysql",
// 	define: {
// 		freezeTableName: true,
// 	},
// 	logging: false,
// });
const sequelize = new Sequelize(
	"rmjvplcu_geniusparkle",
	"rmjvplcu",
	"79yWPhH6Ts+y4[",
	{
		host: "103.212.121.53",
		dialect: "mysql",
		define: {
			freezeTableName: true,
		},
		logging: false,
	}
);
(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
})();
(async () => {
	try {
		await sequelize.sync();
	} catch (error) {
		console.log(error.message);
	}
})();
module.exports = { sequelize };
