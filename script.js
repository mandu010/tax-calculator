function toggleDeductions() {
  const deductionsSection = document.getElementById('deductionsSection');
  if (deductionsSection.style.display === 'none' || deductionsSection.style.display === '') {
      deductionsSection.style.display = 'block';
  } else {
      deductionsSection.style.display = 'none';
  }
}

function calculateTax() {
  // Get input values
  const income = parseFloat(document.getElementById('income').value) || 0;
  const age = document.getElementById('age').value;
  const isSalaried = document.getElementById('isSalaried').value === 'yes';
  
  // Get deduction values for old regime
  const hra = parseFloat(document.getElementById('hra').value) || 0;
  const section80C = Math.min(parseFloat(document.getElementById('section80C').value) || 0, 150000);
  const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;
  const totalDeductions = hra + section80C + otherDeductions;
  
  // Calculate taxes for both regimes
  const newRegimeTax = calculateNewRegimeTax(income, isSalaried);
  const oldRegimeTax = calculateOldRegimeTax(income, age, isSalaried, totalDeductions);
  
  // Display results
  document.getElementById('newRegimeAmount').textContent = formatCurrency(newRegimeTax.totalTax);
  document.getElementById('oldRegimeAmount').textContent = formatCurrency(oldRegimeTax.totalTax);
  
  // Highlight better option
  const newRegimeBox = document.getElementById('newRegimeBox');
  const oldRegimeBox = document.getElementById('oldRegimeBox');
  
  newRegimeBox.classList.remove('better-option');
  oldRegimeBox.classList.remove('better-option');
  
  if (newRegimeTax.totalTax < oldRegimeTax.totalTax) {
      newRegimeBox.classList.add('better-option');
  } else if (oldRegimeTax.totalTax < newRegimeTax.totalTax) {
      oldRegimeBox.classList.add('better-option');
  }
  
  // Generate and display breakdowns
  document.getElementById('newBreakdownItems').innerHTML = generateBreakdownHTML(newRegimeTax.breakdown);
  document.getElementById('oldBreakdownItems').innerHTML = generateBreakdownHTML(oldRegimeTax.breakdown);
  
  // Show results section
  document.getElementById('resultsSection').style.display = 'block';
}

function calculateNewRegimeTax(income, isSalaried) {
  const breakdown = [];
  let taxableIncome = income;
  
  // Apply standard deduction for salaried employees
  if (isSalaried) {
      taxableIncome -= 75000;
      breakdown.push({
          description: "Standard Deduction",
          amount: -75000
      });
  }
  
  breakdown.push({
      description: "Taxable Income",
      amount: taxableIncome
  });
  
  // Calculate tax according to new regime slabs
  let tax = 0;
  
  if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3;
      breakdown.push({
          description: "Tax @30% (>₹15L)",
          amount: (taxableIncome - 1500000) * 0.3
      });
      
      tax += 300000 * 0.2;
      breakdown.push({
          description: "Tax @20% (₹12L-₹15L)",
          amount: 300000 * 0.2
      });
      
      tax += 200000 * 0.15;
      breakdown.push({
          description: "Tax @15% (₹10L-₹12L)",
          amount: 200000 * 0.15
      });
      
      tax += 300000 * 0.1;
      breakdown.push({
          description: "Tax @10% (₹7L-₹10L)",
          amount: 300000 * 0.1
      });
      
      tax += 400000 * 0.05;
      breakdown.push({
          description: "Tax @5% (₹3L-₹7L)",
          amount: 400000 * 0.05
      });
  } 
  else if (taxableIncome > 1200000) {
      tax += (taxableIncome - 1200000) * 0.2;
      breakdown.push({
          description: "Tax @20% (₹12L-₹15L)",
          amount: (taxableIncome - 1200000) * 0.2
      });
      
      tax += 200000 * 0.15;
      breakdown.push({
          description: "Tax @15% (₹10L-₹12L)",
          amount: 200000 * 0.15
      });
      
      tax += 300000 * 0.1;
      breakdown.push({
          description: "Tax @10% (₹7L-₹10L)",
          amount: 300000 * 0.1
      });
      
      tax += 400000 * 0.05;
      breakdown.push({
          description: "Tax @5% (₹3L-₹7L)",
          amount: 400000 * 0.05
      });
  }
  else if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.15;
      breakdown.push({
          description: "Tax @15% (₹10L-₹12L)",
          amount: (taxableIncome - 1000000) * 0.15
      });
      
      tax += 300000 * 0.1;
      breakdown.push({
          description: "Tax @10% (₹7L-₹10L)",
          amount: 300000 * 0.1
      });
      
      tax += 400000 * 0.05;
      breakdown.push({
          description: "Tax @5% (₹3L-₹7L)",
          amount: 400000 * 0.05
      });
  }
  else if (taxableIncome > 700000) {
      tax += (taxableIncome - 700000) * 0.1;
      breakdown.push({
          description: "Tax @10% (₹7L-₹10L)",
          amount: (taxableIncome - 700000) * 0.1
      });
      
      tax += 400000 * 0.05;
      breakdown.push({
          description: "Tax @5% (₹3L-₹7L)",
          amount: 400000 * 0.05
      });
  }
  else if (taxableIncome > 300000) {
      tax += (taxableIncome - 300000) * 0.05;
      breakdown.push({
          description: "Tax @5% (₹3L-₹7L)",
          amount: (taxableIncome - 300000) * 0.05
      });
  }
  
  // Apply rebate u/s 87A
  if (taxableIncome <= 700000 && tax > 0) {
      const rebate = Math.min(tax, 25000);
      tax -= rebate;
      breakdown.push({
          description: "Rebate u/s 87A",
          amount: -rebate
      });
  }
  
  // Apply surcharge if applicable
  let surcharge = 0;
  if (taxableIncome > 5000000) {
      if (taxableIncome <= 10000000) {
          surcharge = tax * 0.1;
          breakdown.push({
              description: "Surcharge @10%",
              amount: surcharge
          });
      } else if (taxableIncome <= 20000000) {
          surcharge = tax * 0.15;
          breakdown.push({
              description: "Surcharge @15%",
              amount: surcharge
          });
      } else {
          surcharge = tax * 0.25;
          breakdown.push({
              description: "Surcharge @25%",
              amount: surcharge
          });
      }
  }
  
  // Add health and education cess
  const cess = (tax + surcharge) * 0.04;
  breakdown.push({
      description: "Health & Education Cess @4%",
      amount: cess
  });
  
  // Calculate total tax
  const totalTax = tax + surcharge + cess;
  
  // Add total as the last item
  breakdown.push({
      description: "Total Tax Liability",
      amount: totalTax
  });
  
  return {
      taxableIncome,
      tax,
      surcharge,
      cess,
      totalTax,
      breakdown
  };
}

function calculateOldRegimeTax(income, age, isSalaried, deductions) {
  const breakdown = [];
  let taxableIncome = income;
  
  // Apply standard deduction for salaried employees
  if (isSalaried) {
      taxableIncome -= 75000;
      breakdown.push({
          description: "Standard Deduction",
          amount: -75000
      });
  }
  
  // Apply deductions
  if (deductions > 0) {
      taxableIncome -= deductions;
      breakdown.push({
          description: "Total Deductions",
          amount: -deductions
      });
  }
  
  breakdown.push({
      description: "Taxable Income",
      amount: taxableIncome
  });
  
  // Set exemption limit based on age
  let exemptionLimit = 250000; // Default for below 60
  if (age === '60to80') {
      exemptionLimit = 300000;
  } else if (age === 'above80') {
      exemptionLimit = 500000;
  }
  
  // Calculate tax according to old regime slabs
  let tax = 0;
  
  if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
      breakdown.push({
          description: "Tax @30% (>₹10L)",
          amount: (taxableIncome - 1000000) * 0.3
      });
      
      tax += 500000 * 0.2;
      breakdown.push({
          description: "Tax @20% (₹5L-₹10L)",
          amount: 500000 * 0.2
      });
      
      if (exemptionLimit < 500000) {
          tax += (500000 - exemptionLimit) * 0.05;
          breakdown.push({
              description: `Tax @5% (₹${formatNumber(exemptionLimit)}-₹5L)`,
              amount: (500000 - exemptionLimit) * 0.05
          });
      }
  } 
  else if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.2;
      breakdown.push({
          description: "Tax @20% (₹5L-₹10L)",
          amount: (taxableIncome - 500000) * 0.2
      });
      
      if (exemptionLimit < 500000) {
          tax += (500000 - exemptionLimit) * 0.05;
          breakdown.push({
              description: `Tax @5% (₹${formatNumber(exemptionLimit)}-₹5L)`,
              amount: (500000 - exemptionLimit) * 0.05
          });
      }
  }
  else if (taxableIncome > exemptionLimit) {
      tax += (taxableIncome - exemptionLimit) * 0.05;
      breakdown.push({
          description: `Tax @5% (₹${formatNumber(exemptionLimit)}-₹5L)`,
          amount: (taxableIncome - exemptionLimit) * 0.05
      });
  }
  
  // Apply rebate u/s 87A
  if (taxableIncome <= 500000 && tax > 0) {
      const rebate = Math.min(tax, 12500);
      tax -= rebate;
      breakdown.push({
          description: "Rebate u/s 87A",
          amount: -rebate
      });
  }
  
  // Apply surcharge if applicable
  let surcharge = 0;
  if (taxableIncome > 5000000) {
      if (taxableIncome <= 10000000) {
          surcharge = tax * 0.1;
          breakdown.push({
              description: "Surcharge @10%",
              amount: surcharge
          });
      } else if (taxableIncome <= 20000000) {
          surcharge = tax * 0.15;
          breakdown.push({
              description: "Surcharge @15%",
              amount: surcharge
          });
      } else if (taxableIncome <= 50000000) {
          surcharge = tax * 0.25;
          breakdown.push({
              description: "Surcharge @25%",
              amount: surcharge
          });
      } else {
          surcharge = tax * 0.37;
          breakdown.push({
              description: "Surcharge @37%",
              amount: surcharge
          });
      }
  }
  
  // Add health and education cess
  const cess = (tax + surcharge) * 0.04;
  breakdown.push({
      description: "Health & Education Cess @4%",
      amount: cess
  });
  
  // Calculate total tax
  const totalTax = tax + surcharge + cess;
  
  // Add total as the last item
  breakdown.push({
      description: "Total Tax Liability",
      amount: totalTax
  });
  
  return {
      taxableIncome,
      tax,
      surcharge,
      cess,
      totalTax,
      breakdown
  };
}

function generateBreakdownHTML(items) {
  let html = '';
  
  for (const item of items) {
      const isNegative = item.amount < 0;
      html += `
          <div class="breakdown-item">
              <div>${item.description}</div>
              <div class="${isNegative ? 'negative-value' : ''}">${formatCurrency(item.amount)}</div>
          </div>
      `;
  }
  
  return html;
}

function formatCurrency(amount) {
  return '₹' + formatNumber(Math.round(amount));
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}