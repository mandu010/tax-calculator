let currentRegime = 'oldRegime';

function switchTab(tab, regime) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  
  // Add active class to clicked tab
  tab.classList.add('active');
  
  // Update current regime
  currentRegime = regime;
  
  // Show/hide old regime specific fields
  if (regime === 'oldRegime') {
    document.getElementById('oldRegimeFields').style.display = 'block';
  } else {
    document.getElementById('oldRegimeFields').style.display = 'none';
  }
}

function calculateTax() {
  // Get values from inputs
  const income = parseFloat(document.getElementById('income').value) || 0;
  const deductions = parseFloat(document.getElementById('deductions').value) || 0;
  const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
  const ageGroup = document.querySelector('input[name="ageGroup"]:checked').value;
  const financialYear = document.getElementById('financialYear').value;
  
  // Calculate taxable income based on regime
  let taxableIncome = income + otherIncome;
  if (currentRegime === 'oldRegime') {
    taxableIncome -= deductions;
  }
  
  // Ensure taxable income is not negative
  taxableIncome = Math.max(0, taxableIncome);
  
  // Calculate tax based on regime, age group and financial year
  let tax = 0;
  
  if (currentRegime === 'oldRegime') {
    tax = calculateOldRegimeTax(taxableIncome, ageGroup, financialYear);
  } else {
    tax = calculateNewRegimeTax(taxableIncome, financialYear);
  }
  
  // Calculate surcharge
  let surcharge = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    surcharge = tax * 0.10;
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    surcharge = tax * 0.15;
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    surcharge = tax * 0.25;
  } else if (taxableIncome > 50000000) {
    surcharge = tax * 0.37;
  }
  
  // Calculate cess
  const cess = (tax + surcharge) * 0.04;
  
  // Calculate total tax liability
  const totalTax = tax + surcharge + cess;
  
  // Update UI
  document.getElementById('taxableIncome').textContent = `₹${taxableIncome.toLocaleString('en-IN')}`;
  document.getElementById('baseTax').textContent = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById('surcharge').textContent = `₹${surcharge.toLocaleString('en-IN')}`;
  document.getElementById('cess').textContent = `₹${cess.toLocaleString('en-IN')}`;
  document.getElementById('totalLiability').textContent = `₹${totalTax.toLocaleString('en-IN')}`;
  document.getElementById('totalTax').textContent = `₹${totalTax.toLocaleString('en-IN')}`;
}

function calculateOldRegimeTax(income, ageGroup, financialYear) {
  let tax = 0;
  let exemptionLimit = 0;
  
  // Set exemption limit based on age group
  if (ageGroup === 'below60') {
    exemptionLimit = 250000;
  } else if (ageGroup === 'senior') {
    exemptionLimit = 300000;
  } else if (ageGroup === 'superSenior') {
    exemptionLimit = 500000;
  }
  
  // Calculate tax for below 60 age group
  if (ageGroup === 'below60') {
    if (income <= exemptionLimit) {
      tax = 0;
    } else if (income <= 500000) {
      tax = (income - exemptionLimit) * 0.05;
    } else if (income <= 1000000) {
      tax = 12500 + (income - 500000) * 0.2;
    } else {
      tax = 112500 + (income - 1000000) * 0.3;
    }
  }
  
  // Calculate tax for senior citizens (60-80 years)
  else if (ageGroup === 'senior') {
    if (income <= exemptionLimit) {
      tax = 0;
    } else if (income <= 500000) {
      tax = (income - exemptionLimit) * 0.05;
    } else if (income <= 1000000) {
      tax = 10000 + (income - 500000) * 0.2;
    } else {
      tax = 110000 + (income - 1000000) * 0.3;
    }
  }
  
  // Calculate tax for super senior citizens (above 80 years)
  else if (ageGroup === 'superSenior') {
    if (income <= exemptionLimit) {
      tax = 0;
    } else if (income <= 1000000) {
      tax = (income - exemptionLimit) * 0.2;
    } else {
      tax = 100000 + (income - 1000000) * 0.3;
    }
  }
  
  // Apply rebate for FY 2024-25 and 2025-26
  if ((financialYear === '2024-25' || financialYear === '2025-26') && income <= 700000) {
    tax = Math.max(0, tax - 25000);
  } else if (income <= 500000) {
    tax = Math.max(0, tax - 12500);
  }
  
  return tax;
}

function calculateNewRegimeTax(income, financialYear) {
  let tax = 0;
  
  // For FY 2024-25 and 2025-26 (updated rates)
  if (financialYear === '2024-25' || financialYear === '2025-26') {
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 900000) {
      tax = 15000 + (income - 600000) * 0.1;
    } else if (income <= 1200000) {
      tax = 45000 + (income - 900000) * 0.15;
    } else if (income <= 1500000) {
      tax = 90000 + (income - 1200000) * 0.2;
    } else {
      tax = 150000 + (income - 1500000) * 0.3;
    }
    
    // Apply rebate under Section 87A for incomes up to 7 lakhs
    if (income <= 700000) {
      tax = Math.max(0, tax - 25000);
    }
  } 
  // For older financial years
  else {
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 900000) {
      tax = 15000 + (income - 600000) * 0.1;
    } else if (income <= 1200000) {
      tax = 45000 + (income - 900000) * 0.15;
    } else if (income <= 1500000) {
      tax = 90000 + (income - 1200000) * 0.2;
    } else {
      tax = 150000 + (income - 1500000) * 0.3;
    }
    
    // Apply rebate under Section 87A for incomes up to 5 lakhs
    if (income <= 500000) {
      tax = Math.max(0, tax - 12500);
    }
  }
  
  return tax;
}