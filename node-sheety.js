const axios = require("axios");

module.exports = function (RED) {
    function SheetyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        console.log(config);
        // node.on('input', function (msg) {
        // msg.payload = msg.payload.toLowerCase();
        // node.send(msg);
        // });
        node.on("input", data => {
            input(RED, node, data, config);
            // var msg = { payload: config }
            // return node.send(msg);
        });
    }
    RED.nodes.registerType("node-sheety", SheetyNode);
};

async function input(RED, node, data, config) {
    let result;
    try {
        let appUrl = config.appUrl; // app/project url in sheety
        let tabName = config.table;
        let itemName = config.itemName;
        let action = config.action;
        let filter = config.filter || data.payload.filter;
        let record = config.record || data.payload.record;
        switch (action) {
            case 'get':
                result = await getRecord(appUrl, tabName);
                break;
            case 'post':
                result = await addRecord(appUrl, tabName, itemName, record);
                break;
            case 'put':
                result = await updateRecord(appUrl, tabName, itemName, record, filter);
                break;
        }
        // var msg = { payload: result, originalMessage: data }
        data.payload.sheetData = result;
        return node.send(data);
    } catch (error) {
        node.error(error);
        return node.send([null, data]);
    }
}

async function getRecord(appUrl, tabName) {
    try {
        const url = `${appUrl}/${tabName}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function addRecord(appUrl, tabName, itemName, record) {
    try {
        const url = `${appUrl}/${tabName}`;
        let data = {};
        data[itemName] = JSON.parse(record);
        console.log(url);
        console.log(data);
        
        const response = await axios({
            method: 'post',
            url: url,
            data: data
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function updateRecord(appUrl, tabName, itemName, record, filter) {
    try {
        const url = `${appUrl}/${tabName}/${filter}`;
        console.log(url);
        console.log(filter);
        let data = {};
        data[itemName] = JSON.parse(record);
        const response = await axios({
            method: 'put',
            url: url,
            data: data
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}