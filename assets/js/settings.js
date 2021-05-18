const enable = document.getElementById('mfa_enable');
const disable = document.getElementById('mfa_disable');
const loading = document.getElementById('mfa_loading');
const enable_b = document.getElementById('mfa_b_enable');
const disable_b = document.getElementById('mfa_b_disable');
const disable_code = document.getElementById('mfa_disable_code');
const qrcode = document.getElementById('mfa_qrcode');
const info = document.getElementById('mfa_info');
enable.style.display = 'none';
disable.style.display = 'none';

function enableMFA() {
    disable.style.display = 'none';
    enable.style.display = '';
    enable_b.addEventListener('click', () => {
        enable_b.classList.add('btn-progress');
        axios.post('/account/mfa', { 
            withCredentials: true, 
            headers: {
                'CSRF-Token': document.getElementById('csrf-token').getAttribute('content') // <-- is the csrf token as a header
            }
        })
        .then((res) => {
            enable_b.style.display = 'none';
            info.style.display = '';
            qrcode.src = res.data.qrCode;
            qrcode.style.display = '';
            qrcode.style.width = '150px';
            qrcode.style.height = '150px';
        })
        .catch((err) => {
            enable_b.classList.remove('btn-progress');
            window.location.reload();
            console.error(err);
        })
    })
}

function disableMFA() {
    enable.style.display = 'none';
    disable.style.display = '';
    disable_b.addEventListener('click', () => {
        axios.delete('/account/mfa', {
            data: {
                code: disable_code.value
            },
            withCredentials: true, 
            headers: {
                'CSRF-Token': document.getElementById('csrf-token').getAttribute('content') // <-- is the csrf token as a header
            }
        })
        .then((res) => {
            if (res.data.message === 'Disabled MFA') {
                window.location.reload();
            }
        })
        .catch((err) => {
            console.error(err);
        })
    })
}
axios.get('/account/mfa')
  .then(function (response) {
        loading.style.display = 'none';
        if (response.data.enabled) {
            disableMFA();
        } else {
            enableMFA();
        }
  })
  .catch(function (error) {
    console.log(error);
  })
