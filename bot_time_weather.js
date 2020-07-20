const {
    Client,
    MessageEmbed
} = require("discord.js");
const client = new Client();
const axios = require("axios");

process.env.API_1 = process.env.API_1 || "Your api_1 openweather"; // openweather 
process.env.API_2 = process.env.API_2 || "Your api_2 openweather"; // IP Geo location




client.on('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}`);
})


client.on("message", async (message) => {

    if (message.content.startsWith("!time")) {
        let targetAux = message.content.split(" ");

        let target = await targetPreparation(targetAux);

        request(target, [process.env.API_1, process.env.API_2]).then(resp => {
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


process.env.secret_token = process.env.secret_token || "your_token";
client.login(process.env.secret_token);