/**
 * 🎀 Pookie's Expense Tracker — Client Application Logic
 * Vanilla JavaScript (ES6+)
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// App State
let expenses = [];
let isLoading = false;
let selectedEmoji = '🧋';

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const nameError = document.getElementById('name-error');
const amountError = document.getElementById('amount-error');
const submitBtn = document.getElementById('submit-btn');
const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

const deleteForm = document.getElementById('delete-form');
const deleteIdInput = document.getElementById('delete-id-input');
const deleteError = document.getElementById('delete-error');
const deleteSubmitBtn = document.getElementById('delete-submit-btn');

const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');
const transactionCountDisplay = document.getElementById('transaction-count');

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');

const fetchAllBtn = document.getElementById('fetch-all-btn');
const refreshListBtn = document.getElementById('refresh-list-btn');
const retryBtn = document.getElementById('retry-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const greetingTitle = document.getElementById('greeting-title');
const toastContainer = document.getElementById('toast-container');
const emojiButtons = document.querySelectorAll('.emoji-btn');

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', () => {
  setGreeting();
  setupEventListeners();
  setupEmojiSelector();
  fetchExpenses();
});

/**
 * Set Dynamic Cute Greeting based on time of day
 */
function setGreeting() {
  if (!greetingTitle) return;
  const hour = new Date().getHours();
  let greeting = 'Hello Pookie! 🌸';
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning, cutie! ☕🌸';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon, pookie! 🧋✨';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening, bestie! 🎀💖';
  } else {
    greeting = 'Sweet dreams, pookie! 🌙✨';
  }
  greetingTitle.textContent = greeting;
}

/**
 * Setup Emoji Category Selector
 */
function setupEmojiSelector() {
  emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      emojiButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedEmoji = btn.getAttribute('data-emoji') || '🧋';
    });
  });
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Add Expense Form (POST)
  if (expenseForm) {
    expenseForm.addEventListener('submit', handleAddExpense);
  }

  // Dedicated Delete Expense Form (DELETE)
  if (deleteForm) {
    deleteForm.addEventListener('submit', handleDeleteByIdForm);
  }

  // Validation Error Clearing
  if (expenseNameInput) {
    expenseNameInput.addEventListener('input', () => clearFieldError(expenseNameInput, nameError));
  }
  if (expenseAmountInput) {
    expenseAmountInput.addEventListener('input', () => clearFieldError(expenseAmountInput, amountError));
  }
  if (deleteIdInput) {
    deleteIdInput.addEventListener('input', () => clearFieldError(deleteIdInput, deleteError));
  }

  // Fetch All / Refresh (GET)
  if (fetchAllBtn) {
    fetchAllBtn.addEventListener('click', () => {
      triggerRefreshAnimation(fetchAllBtn);
      fetchExpenses(true);
    });
  }

  if (refreshListBtn) {
    refreshListBtn.addEventListener('click', () => {
      triggerRefreshAnimation(refreshListBtn);
      fetchExpenses(true);
    });
  }

  // Retry on Server Error
  if (retryBtn) {
    retryBtn.addEventListener('click', () => fetchExpenses());
  }

  // Empty State Button
  if (emptyAddBtn) {
    emptyAddBtn.addEventListener('click', () => {
      if (expenseNameInput) {
        expenseNameInput.focus();
      }
    });
  }
}

/**
 * Animation trigger for refresh button
 * @param {HTMLElement} element
 */
function triggerRefreshAnimation(element) {
  element.classList.add('rotating');
  setTimeout(() => {
    element.classList.remove('rotating');
  }, 800);
}

/**
 * Clear Field Validation Error
 */
function clearFieldError(input, errorElement) {
  if (input) input.classList.remove('input-error');
  if (errorElement) errorElement.textContent = '';
}

/**
 * Set Field Validation Error
 */
function setFieldError(input, errorElement, message) {
  if (input) {
    input.classList.add('input-error');
    input.focus();
  }
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Format Currency to Indian Rupee (₹)
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Contextual Cute Emoji Detector
 * @param {string} name
 * @returns {string}
 */
function getExpenseIcon(name) {
  const lower = (name || '').toLowerCase();
  if (/boba|tea|coffee|latte|matcha|drink|shake|juice/i.test(lower)) return '🧋';
  if (/cupcake|cake|cookie|sweet|donut|icecream|treat|bakery|choco|chocolate/i.test(lower)) return '🧁';
  if (/food|lunch|dinner|breakfast|snack|burger|pizza|pasta|ramen|sushi|meal|mcdonalds/i.test(lower)) return '🍱';
  if (/makeup|cosmetic|skincare|lipstick|perfume|glam|salon|hair|spa|beauty/i.test(lower)) return '💄';
  if (/shop|clothes|dress|skirt|shoes|bag|plushie|gift|amazon|zara|h&m/i.test(lower)) return '🛍️';
  if (/travel|cab|uber|ola|taxi|metro|flight|trip|hotel|outing/i.test(lower)) return '🌸';
  if (/flower|bouquet|tulip|rose|plant/i.test(lower)) return '🌷';
  if (/bill|rent|wifi|electricity|phone|recharge|subscription|netflix|spotify/i.test(lower)) return '💌';
  if (/book|stationery|pen|journal|study|course/i.test(lower)) return '📚';
  return selectedEmoji || '💖';
}

/**
 * Validate Add Expense Form
 */
function validateAddForm() {
  let isValid = true;
  const rawName = expenseNameInput ? expenseNameInput.value.trim() : '';
  const rawAmount = expenseAmountInput ? expenseAmountInput.value.trim() : '';
  const parsedAmount = parseFloat(rawAmount);

  if (!rawName) {
    setFieldError(expenseNameInput, nameError, '🌸 Please enter an expense name, pookie!');
    isValid = false;
  } else if (rawName.length > 60) {
    setFieldError(expenseNameInput, nameError, 'Name must be under 60 characters.');
    isValid = false;
  } else {
    clearFieldError(expenseNameInput, nameError);
  }

  if (!rawAmount) {
    setFieldError(expenseAmountInput, amountError, '💖 Please enter an amount.');
    isValid = false;
  } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
    setFieldError(expenseAmountInput, amountError, 'Amount must be greater than ₹0.');
    isValid = false;
  } else {
    clearFieldError(expenseAmountInput, amountError);
  }

  return { isValid, name: rawName, amount: parsedAmount };
}

/**
 * Set Add Expense Button Loading
 */
function setAddButtonLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  if (btnSpinner) btnSpinner.classList.toggle('hidden', !loading);
  if (btnText) btnText.textContent = loading ? 'Adding Sweet Treat...' : '💖 Add Expense ✨';
}

/**
 * Set Delete Button Loading
 */
function setDeleteButtonLoading(loading) {
  if (!deleteSubmitBtn) return;
  deleteSubmitBtn.disabled = loading;
  const spinner = deleteSubmitBtn.querySelector('.btn-spinner');
  const text = deleteSubmitBtn.querySelector('.btn-text');
  if (spinner) spinner.classList.toggle('hidden', !loading);
  if (text) text.textContent = loading ? 'Deleting...' : '💔 Delete Expense';
}

/**
 * Fetch All Expenses (GET /expenses)
 * @param {boolean} isManualFetch
 */
async function fetchExpenses(isManualFetch = false) {
  isLoading = true;
  showState('loading');

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    expenses = Array.isArray(data) ? data : [];

    updateSummary(expenses);
    renderExpenses(expenses);

    if (isManualFetch) {
      showNotification(`✨ Refreshed ${expenses.length} cute expense${expenses.length === 1 ? '' : 's'}!`, 'info');
    }
  } catch (error) {
    console.error('Error fetching expenses from server:', error);
    showState('error');
    updateSummary([]);
    showNotification('😴 Backend is offline. Check http://localhost:3000', 'error');
  } finally {
    isLoading = false;
  }
}

/**
 * Handle Add Expense Form Submit (POST /expenses)
 */
async function handleAddExpense(event) {
  event.preventDefault();

  const validation = validateAddForm();
  if (!validation.isValid) return;

  const payload = {
    name: validation.name,
    amount: validation.amount
  };

  setAddButtonLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    // Reset Form
    expenseForm.reset();
    clearFieldError(expenseNameInput, nameError);
    clearFieldError(expenseAmountInput, amountError);

    // Refresh & Notify
    await fetchExpenses();
    showNotification('🎀 Yay! Added expense to pookie budget!', 'success');

    if (expenseNameInput) {
      expenseNameInput.focus();
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    showNotification('⚠ Oops! Could not add expense.', 'error');
  } finally {
    setAddButtonLoading(false);
  }
}

/**
 * Handle Dedicated Delete by ID Form (DELETE /expenses/:id)
 */
async function handleDeleteByIdForm(event) {
  event.preventDefault();

  const rawId = deleteIdInput ? deleteIdInput.value.trim() : '';
  if (!rawId) {
    setFieldError(deleteIdInput, deleteError, '💔 Please enter an ID or click an ID badge below.');
    return;
  }

  setDeleteButtonLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(rawId)}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    deleteForm.reset();
    clearFieldError(deleteIdInput, deleteError);

    await fetchExpenses();
    showNotification(`💔 Expense #${rawId} was deleted successfully!`, 'success');
  } catch (error) {
    console.error(`Error deleting expense #${rawId}:`, error);
    showNotification(`⚠ Could not delete expense #${rawId}. Make sure ID exists!`, 'error');
  } finally {
    setDeleteButtonLoading(false);
  }
}

/**
 * Handle Direct Item Delete (DELETE /expenses/:id)
 */
async function deleteExpense(id, itemElement) {
  try {
    if (itemElement) {
      itemElement.classList.add('deleting');
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    await fetchExpenses();
    showNotification('💔 Expense deleted successfully!', 'success');
  } catch (error) {
    console.error(`Error deleting expense with id ${id}:`, error);
    if (itemElement) {
      itemElement.classList.remove('deleting');
    }
    showNotification('⚠ Oops! Failed to delete expense', 'error');
  }
}

/**
 * Update Summary Card
 */
function updateSummary(expenseItems) {
  const total = (expenseItems || []).reduce((acc, curr) => {
    const amt = parseFloat(curr.amount) || 0;
    return acc + amt;
  }, 0);

  const count = (expenseItems || []).length;

  if (totalAmountDisplay) {
    totalAmountDisplay.textContent = formatCurrency(total);
  }

  if (transactionCountDisplay) {
    transactionCountDisplay.textContent = `🎀 ${count} sweet treat${count === 1 ? '' : 's'}`;
  }
}

/**
 * Render List of Expenses
 */
function renderExpenses(expenseItems) {
  if (!expenseList) return;

  if (!expenseItems || expenseItems.length === 0) {
    showState('empty');
    expenseList.innerHTML = '';
    return;
  }

  showState('list');
  expenseList.innerHTML = '';

  expenseItems.forEach((expense, index) => {
    const expenseId = expense.id !== undefined ? expense.id : index + 1;
    const name = expense.name || 'Sweet Treat';
    const amount = parseFloat(expense.amount) || 0;
    const icon = getExpenseIcon(name);

    const li = document.createElement('li');
    li.className = 'expense-item';
    li.setAttribute('data-id', expenseId);

    li.innerHTML = `
      <div class="expense-left">
        <div class="expense-avatar" aria-hidden="true">${icon}</div>
        <div class="expense-details">
          <div class="expense-name-row">
            <span class="expense-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
            <span class="expense-id-pill" title="Click to fill ID in Delete form">#${expenseId}</span>
          </div>
          <span class="expense-tag">🌸 Monies logged</span>
        </div>
      </div>
      <div class="expense-right">
        <span class="expense-amount">${formatCurrency(amount)}</span>
        <button type="button" class="btn-delete-item" title="Delete ${escapeHtml(name)}" aria-label="Delete ${escapeHtml(name)}">
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    `;

    // Click ID pill to auto-populate the Delete Expense form
    const idPill = li.querySelector('.expense-id-pill');
    if (idPill) {
      idPill.addEventListener('click', () => {
        if (deleteIdInput) {
          deleteIdInput.value = expenseId;
          deleteIdInput.focus();
          showNotification(`🎀 Selected ID #${expenseId} for deletion`, 'info', 2000);
        }
      });
    }

    // Direct Delete button on item
    const deleteBtn = li.querySelector('.btn-delete-item');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteExpense(expenseId, li);
      });
    }

    expenseList.appendChild(li);
  });
}

/**
 * Control UI State Display
 */
function showState(state) {
  if (loadingState) loadingState.classList.toggle('hidden', state !== 'loading');
  if (errorState) errorState.classList.toggle('hidden', state !== 'error');
  if (emptyState) emptyState.classList.toggle('hidden', state !== 'empty');
  if (expenseList) expenseList.style.display = (state === 'list') ? 'flex' : 'none';
}

/**
 * Pookie Toast Notification
 */
function showNotification(message, type = 'info', duration = 3500) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '🎀';
  if (type === 'error') iconSvg = '💔';
  if (type === 'info') iconSvg = '✨';

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${iconSvg}</span>
      <span>${escapeHtml(message)}</span>
    </div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', removeToast);
  }

  toastContainer.appendChild(toast);
  setTimeout(removeToast, duration);
}

/**
 * Escape HTML string helper
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
