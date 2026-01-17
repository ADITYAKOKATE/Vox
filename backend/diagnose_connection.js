const http = require('http');
const os = require('os');

const PORT = 5000;

// Get Local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const localIP = getLocalIP();
console.log(`🔍 DIAGNOSTIC: Checking connection to http://${localIP}:${PORT}...`);

const req = http.get(`http://${localIP}:${PORT}`, (res) => {
    console.log(`✅ SUCCESS: Connected to Backend! Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`📜 Response Body: ${data}`);
        console.log('---');
        console.log('🚀 CONCLUSION: The Backend IS reachable via Local IP.');
        console.log('If your phone still cannot connect, it is CERTAINLY a Windows Firewall issue blocking external devices.');
        console.log('Please Explicitly ALLOW port 5000 in Inbound Rules.');
    });

}).on('error', (err) => {
    console.error(`❌ FAILURE: Could not connect to http://${localIP}:${PORT}`);
    console.error(`Error details: ${err.message}`);
    console.log('---');
    console.log('⚠️ CONCLUSION: The Backend is NOT listening on the Local IP properly.');
});

req.end();
