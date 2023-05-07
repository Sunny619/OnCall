const cassandra = require('cassandra-driver');
let instance = null;
const client = new cassandra.Client({ contactPoints: ['192.168.64.8', '192.168.64.9'], localDataCenter: 'dc1', keyspace: 'oncall' });
client.connect((err) => {
    if (err)
        return console.error(err);
    console.log("Connected to cluster");
});

class dbService {
    static getDbServiceInstance() {

        return instance ? instance : new dbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "Select * FROM assignments;"
                client.execute(query, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response);
            return response;
        } catch (err) {
            console.log(err)
        }
    }
    async insertRow(rowData) {
        const { year, start_date, end_date, primary_call, secondary_call, team } = rowData;
        const s_date = new Date(start_date);
        const e_date = new Date(end_date);
        //console.log(day);
        try {
            const response1 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where start_date>=? and start_date<=? and team = ? ALLOW FILTERING;`
                client.execute(query, [s_date, e_date, team], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response1['rows'].length)
            if (response1['rows'].length > 0) {
                return 2;
            }
        } catch (err) {
            console.log(err)
        }

        try {
            const response2 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where end_date>=? and end_date<=? and team = ?  ALLOW FILTERING;`
                client.execute(query, [s_date, e_date, team], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response2['rows'].length)
            if (response2['rows'].length > 0) {
                return 2;
            }
        } catch (err) {
            console.log(err)
        }
        try {
            const response3 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where start_date<=? and end_date>=? and team = ? ALLOW FILTERING;`
                client.execute(query, [s_date, s_date, team], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            if (response3['rows'].length > 0) {
                return 2;
            }
        } catch (err) {
            console.log(err)
        }
        try {
            const response = await new Promise((resolve, reject) => {
                const query = " Insert into assignments(year, start_date,  end_date, team,primary_call, secondary_call) values(?,?,?,?,?,?) IF NOT EXISTS;"
                client.execute(query, [year, s_date, e_date, team, primary_call, secondary_call], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //const data = JSON.parse(response);
            const isValid = response['rows'][0]['[applied]'];
            //console.log(response['rows'][0]['[applied]']);
            if (isValid)
                return 0;
            else
                return 1;
            //return isValid;
        } catch (err) {
            console.log(err)
        }
    }
    async deleteRow(year, start_date, end_date, team) {
        const s_date = new Date(start_date);
        const e_date = new Date(end_date);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = " Delete from assignments where year = ? and start_date = ? and end_date=? and team=?;"
                client.execute(query, [year, s_date, e_date, team], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response);
            return year;
        } catch (err) {
            console.log(err)
        }
    }
    async ModifyRow(data) {
        const { val, col, year, start_date, end_date, team } = data
        console.log("Hello")
        console.log(val, col, year, start_date, end_date, team)
        const s_date = new Date(start_date);
        const e_date = new Date(end_date);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `Update assignments set ${col} = ? where year = ? and start_date = ? and end_date=? and team=?;`;
                client.execute(query, [val, year, s_date, e_date, team], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            console.log(response);
            return year;
        } catch (err) {
            console.log(err)
        }
    }
    async searchByName(val) {
        try {
            const response1 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where primary_call = ? ALLOW FILTERING;`
                client.execute(query, [val], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            const response2 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where secondary_call = ? ALLOW FILTERING;`
                client.execute(query, [val], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            const response = response1['rows'].concat(response2['rows']);
            console.log(response)
            return response;
        } catch (err) {
            console.log(err)
        }
    }
    async searchByTeam(val) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `select * from assignments where team = ? ALLOW FILTERING;`
                client.execute(query, [val], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            return response['rows'];
        } catch (err) {
            console.log(err)
        }
    }
    async searchByDate(start_date, end_date) {
        try {
            const s_date = new Date(start_date);
            const e_date = new Date(end_date);
            //console.log(s_date, e_date);
            const response1 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where start_date>=? and start_date<=? ALLOW FILTERING;`
                client.execute(query, [s_date, e_date], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            const response2 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where end_date>=? and end_date<=? ALLOW FILTERING;`
                client.execute(query, [s_date, e_date], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            const response3 = await new Promise((resolve, reject) => {
                const query = `select * from assignments where start_date<=? and end_date>=? ALLOW FILTERING;`
                client.execute(query, [s_date, s_date], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            const response = new Array();
            var map = new Map();
            response1['rows'].forEach((val) => {
                response.push(val)
                map.set(val['start_date'] + val['end_date'] + val['team'], 1);
            })
            response2['rows'].forEach((val) => {
                if (!map.has(val['start_date'] + val['end_date'] + val['team']))
                    response.push(val);
            })
            response3['rows'].forEach((val) => {
                if (!map.has(val['start_date'] + val['end_date'] + val['team']))
                    response.push(val);
            })
            return response;
        } catch (err) {
            console.log(err)
        }
    }

    // Teams
    async getTeamAll() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "Select * FROM teams;"
                client.execute(query, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response);
            return response;
        } catch (err) {
            console.log(err)
        }
    }
    
    async insertRowTeam(rowData) {
        const {team, name } = rowData;
        try {
            const response = await new Promise((resolve, reject) => {
                const query = " Insert into teams(team,name) values(?,?) IF NOT EXISTS;"
                client.execute(query, [ team, name], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //const data = JSON.parse(response);
            const isValid = response['rows'][0]['[applied]'];
            //console.log(response['rows'][0]['[applied]']);
            if (isValid)
                return 0;
            else
                return 1;
            //return isValid;
        } catch (err) {
            console.log(err)
        }
    }

    async deleteRowTeam(team, name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = " Delete from teams where team=? and name = ?;"
                client.execute(query, [team, name], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            //console.log(response);
            return response;
        } catch (err) {
            console.log(err)
        }
    }
    async searchByTeamInTeams(val) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `select * from teams where team = ?;`
                client.execute(query, [val], { prepare: true }, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            return response['rows'];
        } catch (err) {
            console.log(err)
        }
    }
    async getTeams() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `select team from teams group by team;`
                client.execute(query, (err, results) => {
                    if (err) reject(new Error(err));
                    resolve(results);
                })
            });
            return response;
        } catch (err) {
            console.log(err)
        }
    }
}
module.exports = dbService;