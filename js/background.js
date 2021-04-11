let timer;
try {
    const paytm_api_url = "https://paytm.com/papi/v2/gold/product-portfolio";
    let timer_values = {
        hour_in_secs : 60 * 60 * 1000,
        min_in_secs : 60 * 1000,
        one_day_in_secs : 24 * 60 * 60 * 1000,
        every_two_seconds : 2 * 1000
    };
    chrome.runtime.onMessage.addListener(data => {
        if (data.type === 'subscribe') {
            subscribe();
        }
        else if (data.type === 'unsubscribe') {
            unsubscribe();
        }
    });
    
    function subscribe(){
        try {
            if(timer) {
                clearInterval(timer);
            }
            timer = setInterval(() => {
                fetchGoldPriceFromPaytm();
            }, timer_values.hour_in_secs);
            localStorage.setItem('goldtimer',timer);
            let dayEndTimestamp = (new Date(new Date().setHours(23, 59, 59, 000))).getTime();
            let timer_end = (dayEndTimestamp - Date.now());
            setTimeout(() => {
                clearInterval(timer);
                localStorage.removeItem('goldtimer');
            }, timer_end);   
        } catch (error) {
            console.log('error',error);
        }
    }
    
    function unsubscribe() {
        timer = localStorage.getItem('goldtimer');
        clearInterval(timer);
        localStorage.removeItem('goldtimer');
    }
    
    function fetchGoldPriceFromPaytm() {
        fetch(paytm_api_url)
        .then(response => response.json()) 
        .then(json => {
            const response = json;
            chrome.notifications.create('', {
                title: `Latest Gold Price by ${response.portfolio.product_level[0].merchant.name}`,
                message: `Buy Price : ${response.portfolio.product_level[0].price_per_gm}, Sell Price : ${response.portfolio.product_level[0].sell_price_per_gm}`,
                type: 'basic',
                iconUrl: '/images/gold_32.png'
            });
        })
        .catch(err => console.log(err));
    }; 
} catch (error) {
    timer = localStorage && localStorage.getItem('goldtimer');
    if(timer) {
        clearInterval(timer);
    }
}