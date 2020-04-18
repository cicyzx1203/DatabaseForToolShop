/**
 * Created by jowanzajoseph on 11/16/17.
 */


// ==================== Route Configurations =========================

module.exports = {
  method: 'POST',
  path: '/example',
  config: {
    handler: handleExample
  }
};




function handleExample (request, reply) {

  let age = request.payload.age;
  let height = request.payload.height;

  let returnPayload = {'your_age_next_year': parseInt(age)+1, 'your_height_next_year': parseInt(height)+1 };

  reply(returnPayload)

}