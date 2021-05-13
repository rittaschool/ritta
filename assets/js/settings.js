const enable = document.getElementById('mfa_enable');
const disable = document.getElementById('mfa_disable');
const loading = document.getElementById('mfa_loading');
const enable_b = document.getElementById('mfa_b_enable');
const disable_b = document.getElementById('mfa_b_disable');
enable.style.display = 'none';
disable.style.display = 'none';

axios.get('/account/mfa')
  .then(function (response) {
        loading.style.display = 'none';
        if (response.body.enabled) {
            disable.style.display = '';
            disable_b.addEventListener('click', () => {
                alert('Disable')
            })
        } else {
            enable.style.display = '';
            enable_b.addEventListener('click', () => {
                alert('Disable')
            })
        }
  })
  .catch(function (error) {
    console.log(error);
  })