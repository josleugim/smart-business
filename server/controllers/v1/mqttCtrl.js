/**
 * Created by Mordekaiser on 20/06/16.
 */
module.exports = function (client) {
    return {
        post: postMqtt
    };
    
    function postMqtt(req, res) {
        console.log('Publishing to broker');
        console.log(req.query);
        var query = {};
        if(req.query.status == "true") {
            query.status = "1";
        }
        if(req.query.status == "false") {
            query.status = "0";
        }
        console.log(query);
        client.publish('josleugim/groundfloor/frontyard/lamp2', query.status,
            {
                retain: false,
                qa: 0
            });
        res.status(200).json({success: true});
        res.end();
    }
};