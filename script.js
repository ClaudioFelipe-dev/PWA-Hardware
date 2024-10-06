const cep = document.querySelector('#cep');
const address = document.querySelector('#address');
const neighborhood = document.querySelector('#neighborhood');
const city = document.querySelector('#city');
const message = document.querySelector('#message');

async function getAddressByGeolocation(latitude, longitude) {
    try {
        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        
        if (!response.ok) {
            throw new Error('Não foi possível buscar o endereço pela geolocalização.');
        }

        const data = await response.json();

        if (!data || !data.address) {
            throw new Error('Endereço não encontrado.');
        }

        
        address.value = data.address.road || '';
        neighborhood.value = data.address.neighbourhood || '';
        city.value = data.address.city || data.address.town || '';
        cep.value = data.address.postcode || '';

    } catch (error) {
        console.error('Erro ao obter endereço:', error);
        message.textContent = 'Erro ao obter endereço pela geolocalização.';
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    }
}


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await getAddressByGeolocation(latitude, longitude);
        }, (error) => {
            console.error('Erro ao obter a localização:', error);
            message.textContent = 'Não foi possível obter sua localização.';
            setTimeout(() => {
                message.textContent = '';
            }, 5000);
        });
    } else {
        message.textContent = 'Geolocalização não é suportada neste navegador.';
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    }
}


getUserLocation();


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado:', reg))
            .catch(err => console.log('Erro ao registrar Service Worker:', err));
    });
}
