// by using joi we are validating schema

const Joi =require('joi');
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // number hona chahiye.. mandatory hona chaiye .. aur negative nahi hona chahiye
        image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }),
        // image must be string and empty string and null values are alllowd in the string as we have set the deafult value
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  
        comment: Joi.string().required(),
    }).required(),

    // dekho issme review hona chahiye ar wo required hina chahiye.. aur review mae rating aur comment hona chahiyr aur wo bhi required honi chahiye
})

