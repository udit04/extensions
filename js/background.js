let timer;
let paytm_gold_url = "https://paytm.com/digitalgold?utm_source=extension&utm_medium=udiwal789";
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
            chrome.notifications.create(paytm_gold_url, {
                title: `Latest 24K Gold Price by ${response.portfolio.product_level[0].merchant.name}`,
                message: `Buy Price : ${response.portfolio.product_level[0].price_per_gm}/g, Sell Price : ${response.portfolio.product_level[0].sell_price_per_gm}/g`,
                type: 'basic',
                iconUrl: '/images/gold_32.png'
            });
            chrome.notifications.onClicked.addListener(function(notificationId) {
                if(notificationId === paytm_gold_url){
                    chrome.tabs.create({url: notificationId});
                }
            });
        })
        .catch(err => console.log(err));
    }; 
} catch (error) {
    timer = timer || (localStorage && localStorage.getItem('goldtimer'));
    if(timer) {
        clearInterval(timer);
    }
}