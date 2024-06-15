const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');

// Konstanta untuk kode warna ANSI
const COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

// Fungsi untuk membaca data akun dari file data.txt
const readAccounts = () => {
    const data = fs.readFileSync('data.txt', 'utf-8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};

// Fungsi untuk login ke API
const login = async (accountQuery) => {
    const params = new URLSearchParams(accountQuery);
    const user = decodeURIComponent(params.get('user'));

    let userData;
    try {
        userData = JSON.parse(user);
    } catch (error) {
        console.error(COLORS.red, 'Gagal mem-parsing data user:', error.message, COLORS.reset);
        return null;
    }

    const payload = {
        uid: parseInt(userData.id || ''),
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        username: userData.username || '',
        tg_login_params: accountQuery
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/user/login', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.data.code === 200) {
            return {
                token: response.data.data.token,
                uid: response.data.data.user.uid,
                nickname: response.data.data.user.nickname
            };
        } else {
            throw new Error(`Login failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Login failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk cek balance
const checkBalance = async (token, uid) => {
    const payload = { uid };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Origin': 'https://tgapp.matchain.io',
        'Referer': 'https://tgapp.matchain.io/',
        'X-Amz-Cf-Id': 'ua38_unUINhdH1RlbH9M3r8w9pVIkUtUbttLARioN_AjjTAkTaa8uQ==',
        'X-Requested-With': 'XMLHttpRequest',
        'DNT': '1',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/balance', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Balance check failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Balance check failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk cek waktu klaim reward
const checkRewardTime = async (token, uid) => {
    const payload = { uid };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
        'Origin': 'https://tgapp.matchain.io',
        'Referer': 'https://tgapp.matchain.io/'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/reward', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Reward check failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Reward check failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk klaim reward
const claimReward = async (token, uid) => {
    const payload = { uid };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/reward/claim', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Reward claim failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Reward claim failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk memulai farming
const startFarming = async (token, uid) => {
    const payload = { uid };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/reward/farming', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Farming start failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Farming start failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk cek daftar tugas
const checkTasks = async (token, uid) => {
    const payload = { uid };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Origin': 'https://tgapp.matchain.io',
        'Referer': 'https://tgapp.matchain.io/'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/task/list', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Task list check failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Task list check failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi untuk klaim tugas
const claimTask = async (token, uid, taskType, taskDescription) => {
    const payload = {
        uid,
        type: taskType
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.post('https://tgapp-api.matchain.io/api/tgapp/v1/point/task/claim', payload, { headers });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(`Task claim failed with code: ${response.data.code}`);
        }
    } catch (error) {
        console.error(COLORS.red, 'Task claim failed:', error.message, COLORS.reset);
        return null;
    }
};

// Fungsi utama untuk menjalankan proses login, cek balance, cek reward, klaim reward, cek tugas, dan memulai farming
const processAccount = async (accountQuery, index) => {
    const loginResult = await login(accountQuery);
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');

    if (loginResult) {
        const balanceResult = await checkBalance(loginResult.token, loginResult.uid);
        if (balanceResult !== null) {
            const balanceInK = (balanceResult / 1000).toFixed(1);
            console.log(`[${timestamp}] ${COLORS.green}Login Sukses${COLORS.reset} nickname: ${COLORS.yellow}${loginResult.nickname}${COLORS.reset}  Balance: ${COLORS.green}${balanceInK}${COLORS.reset}`);

            const rewardCheckResult = await checkRewardTime(loginResult.token, loginResult.uid);
            if (rewardCheckResult !== null) {
                const nextClaimTime = rewardCheckResult.next_claim_timestamp;
                const currentTime = Date.now();

                if (nextClaimTime > currentTime) {
                    console.log(`[${timestamp}] ${COLORS.yellow}Belum waktunya claim Next Claim at : ${new Date(nextClaimTime).toLocaleString()}${COLORS.reset}`);
                } else {
                    const rewardResult = await claimReward(loginResult.token, loginResult.uid);
                    if (rewardResult !== null) {
                        console.log(`[${timestamp}] ${COLORS.green}Claim sukses${COLORS.reset} claim balance : ${COLORS.green}${rewardResult}${COLORS.reset}`);

                        const farmingResult = await startFarming(loginResult.token, loginResult.uid);
                        if (farmingResult !== null) {
                            console.log(`[${timestamp}] ${COLORS.green}Start Farming Sukses${COLORS.reset}`);
                        } else {
                            console.log(`[${timestamp}] ${COLORS.red}Start Farming Gagal${COLORS.reset}`);
                        }
                    } else {
                        console.log(`[${timestamp}] ${COLORS.red}Claim gagal${COLORS.reset}`);
                    }
                }
            } else {
                console.log(`[${timestamp}] ${COLORS.red}Reward check failed${COLORS.reset}`);
            }

            const taskList = await checkTasks(loginResult.token, loginResult.uid);
            if (taskList !== null) {
                let allTasksDone = true;

                for (const task of taskList) {
                    if (!task.complete) {
                        allTasksDone = false;
                        const claimResult = await claimTask(loginResult.token, loginResult.uid, task.name, task.description);
                        if (claimResult === null) {
                            console.log(`[${timestamp}] ${COLORS.red}Claim Task ${task.description} Gagal${COLORS.reset}`);
                        } else {
                            console.log(`[${timestamp}] ${COLORS.green}Claim Task ${task.description} Sukses${COLORS.reset}`);
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2 detik antara setiap klaim tugas
                    }
                }

                if (allTasksDone) {
                    console.log(`[${timestamp}] ${COLORS.green}Seluruh misi telah selesai${COLORS.reset}`);
                }
            } else {
                console.log(`[${timestamp}] ${COLORS.red}Task list check failed${COLORS.reset}`);
            }
        } else {
            console.log(`[${timestamp}] ${COLORS.red}Balance check failed${COLORS.reset}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay untuk menghindari rate limit
    } else {
        console.log(`[${timestamp}] ${COLORS.red}Account ${String(index + 1).padStart(2, '0')} Login Gagal${COLORS.reset}`);
    }
};

// Fungsi untuk menentukan next claim timestamp terdekat dari semua akun
const getNextClaimTimestamp = async () => {
    const accounts = readAccounts();
    let earliestTimestamp = null;

    for (let i = 0; i < accounts.length; i++) {
        const loginResult = await login(accounts[i]);
        if (loginResult) {
            const rewardCheckResult = await checkRewardTime(loginResult.token, loginResult.uid);
            if (rewardCheckResult && rewardCheckResult.next_claim_timestamp) {
                if (earliestTimestamp === null || rewardCheckResult.next_claim_timestamp < earliestTimestamp) {
                    earliestTimestamp = rewardCheckResult.next_claim_timestamp;
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay untuk menghindari rate limit
    }

    return earliestTimestamp;
};

// Fungsi utama untuk menjalankan proses dan mengatur interval berdasarkan next claim timestamp
const main = async () => {
    const accounts = readAccounts();
    console.log(`Jumlah Account: ${accounts.length}`);

    for (let i = 0; i < accounts.length; i++) {
        await processAccount(accounts[i], i);
    }

    const nextClaimTimestamp = await getNextClaimTimestamp();
    if (nextClaimTimestamp) {
        const currentTime = Date.now();
        const delay = nextClaimTimestamp - currentTime;
        const nextTime = moment(nextClaimTimestamp).format('HH:mm');

        console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${COLORS.cyan}~~~~~~Next claim ${nextTime}${COLORS.reset}`);

        setTimeout(main, delay); // Menjadwalkan ulang berdasarkan next claim timestamp terdekat
    } else {
        console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Tidak ada next claim timestamp yang ditemukan. Menjadwalkan ulang dalam 1 jam.`);
        setTimeout(main, 60 * 60 * 1000); // Menjadwalkan ulang dalam 1 jam jika tidak ada next claim timestamp
    }
};

// Jalankan skrip untuk pertama kali
main();
