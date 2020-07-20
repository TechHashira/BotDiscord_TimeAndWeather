const {
    Client,
    MessageEmbed
} = require("discord.js");
const client = new Client();
const axios = require("axios");

const api_key_coords = "7dbcdc69353895ca4a62c99225087539"; // openweather 
const api_key_time = "65d89176c0dc4368828a81cad9de1a1b"; // IP Geo lcation


client.on('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}`);
})


client.on("message", async (message) => {

    if (message.content.startsWith("!time")) {
        let targetAux = message.content.split(" ");

        let target = await targetPreparation(targetAux);

        request(target, [api_key_coords, api_key_time]).then(resp => {
            const embed = new MessageEmbed();
            embed.setTitle("Time and Weather")
                .setDescription(`${resp.time_12} in ${resp.timezone}, with ${resp.temp} °C`)
                .setThumbnail("https://i.imgur.com/wOUlNZa.gif");

            message.reply(embed);

        }).catch(err => {
            const embed = new MessageEmbed();
            embed.setTitle("Error")
                .setColor("RED")
                .setDescription(`Invalid Data`);
            message.reply(embed);
        })
    }
})

const request = async (target, api_keys) => {


    const resp_coords = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${target}&appid=${api_keys[0]}&units=Metric`);

    const coords = resp_coords.data.coord; //coordenadas
    const temp = resp_coords.data.main.temp; //Temperatura

    const resp_time = await axios.get(`https://api.ipgeolocation.io/timezone?apiKey=${api_keys[1]}&lat=${coords.lat}&long=${coords.lon}`);

    let country_info = {
        temp,
        timezone: resp_time.data.timezone,
        time_12: resp_time.data.time_12
    }

    return country_info;

}


//Prepara el target para ahcer la request con el formato: el salvador => El+Salvador
const targetPreparation = async (target) => {
    let targetFormated = [];

    if (target.length > 2) {

        target.shift();
        target.forEach(element => targetFormated.push(element.replace(/^\w/, (c) => c.toUpperCase())));

        targetFormated = targetFormated.join("+");

        return targetFormated;
    } else {
        target.shift();
        return target[0].replace(/^\w/, (c) => c.toUpperCase());
    }
}


client.login("NzM0NDg0MTkzNTY4MDk2MzQ3.XxUrLA.giaCQ3YOyMTI71n7c8nAse_cqAw");