const Insurance = require('../model/Insurance');

// Get all insurance providers
exports.getAllInsuranceProviders = async (req, res) => {
  try {
    const providers = await Insurance.find();
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an insurance provider by ID
exports.getInsuranceProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Insurance.findById(id);
    if (!provider) {
      return res.status(404).json({ error: 'Insurance provider not found' });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new insurance provider
exports.createInsuranceProvider = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const newProvider = new Insurance({ name, icon });
    await newProvider.save();
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new insurance providers
exports.createInsuranceProviders = async (req, res) => {
  try {
    const providers = req.body;
    const newProviders = await Insurance.insertMany(providers);
    res.status(201).json(newProviders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing insurance provider
exports.updateInsuranceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const updatedProvider = await Insurance.findByIdAndUpdate(id, { name, icon }, { new: true });
    if (!updatedProvider) {
      return res.status(404).json({ error: 'Insurance provider not found' });
    }
    res.status(200).json(updatedProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update insurance data
exports.updateInsuranceData = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    const updatedInsurance = await Insurance.findOneAndUpdate({ userId }, updateData, { new: true });
    if (!updatedInsurance) {
      return res.status(404).json({ error: 'Insurance data not found' });
    }
    res.status(200).json(updatedInsurance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get insurance data by userId
exports.getInsuranceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const insuranceData = await Insurance.findOne({ userId });
    if (!insuranceData) {
      return res.status(404).json({ error: 'Insurance data not found' });
    }
    res.status(200).json(insuranceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an insurance provider
exports.deleteInsuranceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProvider = await Insurance.findByIdAndDelete(id);
    if (!deletedProvider) {
      return res.status(404).json({ error: 'Insurance provider not found' });
    }
    res.status(200).json({ message: 'Insurance provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};