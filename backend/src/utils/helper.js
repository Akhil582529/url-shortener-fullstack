let counter = 100000;
const generateShortCode = () =>{
    const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let num = counter++;
    let result = '';

    while(num > 0){
        result = base62[num%62] + result;
        num = Math.floor(num/62);
    }

    return result;
}

export default generateShortCode;