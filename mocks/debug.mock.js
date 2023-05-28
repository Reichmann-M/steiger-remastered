module.exports.generateRandomNumberString = (length) => {
    let number = '';
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }
    return number;
}

const messageRaw = {
    author: {
        id: undefined
    },
    client: {
        ownerID: undefined,
        user: {
            username: 'Bot Username',
        },
        guilds: {
            cache: {
                size: 5
            }
        },
        voice: {
            connections: {
                size: 3
            }
        }
    },
    reply: function (replyMessage) { console.log(`Sending mock reply message: ${replyMessage}`) }
}

module.exports.mockMessageByBotOwner = () => {
    const message = justclone(messageRaw)
    const randomUserID = this.generateRandomNumberString(18)
    message.author.id = randomUserID;
    message.client.ownerID = randomUserID;
    return message
}

module.exports.mockMessageByNotOwner = () => {
    const message = justclone(messageRaw)
    message.author.id = '6549387435047263894';
    message.client.ownerID = '1105840092242784266';
    return message
}