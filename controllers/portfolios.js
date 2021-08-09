const mongoose = require('mongoose');
const Portfolio = mongoose.model('Portfolio');

exports.getPortfolios = async (req, res) => {
  const portfolios = await Portfolio.find({});
  return res.json(portfolios);
};

exports.getPortfolioById = async (req, res) => {
  // console.log("getPortfolioById: ", req.params.id);
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({error: { message: 'Not Found'} });
    }
    return res.json(portfolio); 
  } catch (error) {
    // DO NOT use this error message: error.message
    return res.status(400).json({error: { message: 'API Error'} });
  }
};

exports.createPortfolio = async (req, res) => {
  const portfolioData = req.body;
  const userId = req.user.sub;
  const portfolio = new Portfolio(portfolioData);
  portfolio.userId = userId;
  
  try {
    const newPortfolio = await portfolio.save();
    // console.log("Data after saved: ", newPortfolio);
    return res.json(newPortfolio);
  } catch (error) {
    //return res.status(422).json({error: { message: 'API Error'} });
    return res.status(422).send(error.message);
  }
}

exports.updatePortfolio = async (req, res) => {
  const { body, params: {id} } = req;

  try {
    const updatedPortfolio = 
      await Portfolio.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true});
    // console.log("In Node API, Data after updated: \n", updatedPortfolio);
    return res.json(updatedPortfolio);
  } catch (error) {
    return res.status(422).send(error.message);
  }
}

exports.deletePortfolio = async (req, res) => {

  try {
    const portfolio = 
      await Portfolio.findOneAndRemove({_id: req.params.id});
    // console.log("In Node API, Data after deletion: \n", portfolio);
    return res.status(200).json({_id: portfolio._id});
  } catch (error) {
    return res.status(422).send(error.message);
  }
}

