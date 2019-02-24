const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    /**
    await Mail.sendMail({
      from: '"Danyllo Silva" <danyllo.dvs@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra ${purchaseAd.title}`,
      // html: `<p>teste ${content}</p>`
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
    })
    */

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
