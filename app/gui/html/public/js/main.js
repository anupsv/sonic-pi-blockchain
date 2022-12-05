import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet("your_private_key_string", provider);

const songsCatalogAddress = "0xF403Ca77cF2B93e1fb65CEED3e509726a3534Fbb";

const contractAbi = [
    "function getSong(uint64) view returns (string)",
    "function addSong(string, catalogId)",
];

// The Contract object
const songsContract = new ethers.Contract(songsCatalogAddress, contractAbi, provider);

var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:4558", // URL to your Web Socket server.
    metadata: true
});

var editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    mode: "text/x-ruby",
    tabMode: "indent",
    matchBrackets: true,
    indentUnit: 2,
    lineNumbers: true,
    value: "#code-editor"
});

var buttons = new Vue({
  el: '#buttons',
    methods: {
        runCode: function () {
            oscPort.send({
                address: "/run-code",
                args: [
                    {
                        type: "s",
                        value: "websocket-gui"
                    },
                    {
                        type: "s",
                        value: editor.getValue()
                    },

                ]
            })
        },

        stopCode: function () {
            oscPort.send({
                address: "/stop-all-jobs",
                args: [
                    {
                        type: "s",
                        value: "websocket-gui"
                    }
                ]
            })
        }
    }
})


var debug_log = new Vue({
    el: '#debug-log',
    data: {
        logs: [
        ]
    }
})

var info_log = new Vue({
    el: '#info-log',
    data: {
        logs: [
        ]
    }
})

var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:4558", // URL to your Web Socket server.
    metadata: true
});


oscPort.on("message", async function (oscMsg) {
    let osc_path = oscMsg.address;
    let osc_args = oscMsg.args.map(x => x.value);

    debug_log.logs.push(osc_path + ", " + JSON.stringify(osc_args));

    switch(osc_path) {
    case "/log/info":
        info_log.logs.push(JSON.stringify(osc_args[1]));
        break;
    case "/buffer/replace":
        let song = await songsContract.getSong();
        editor.setValue(atob(song));
        break;
    }


});

oscPort.open();

console.log("yeeeeysss");
