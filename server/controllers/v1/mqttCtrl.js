/**
 * Created by Mordekaiser on 20/06/16.
 */
module.exports = function (client) {
    return {
        post: postMqtt
    };
    
    function postMqtt(req, res) {
        console.log('Publishing to broker');
        client.publish('josleugim/groundfloor/frontyard/lamp2', '1',
            {
                retain: false,
                qa: 0
            });
    }
};