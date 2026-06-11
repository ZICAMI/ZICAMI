// =====================================================
// ORDER FORM - JAVASCRIPT
// Handles: color switching, quantity stepper, validation
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- ELEMENT REFERENCES ----------
  const productImage = document.getElementById('productImage');
  const selectedColorLabel = document.getElementById('selectedColorLabel');
  const swatches = document.querySelectorAll('.swatch');

  const formColorRadios = document.querySelectorAll('input[name="formColor"]');

  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const quantityInput = document.getElementById('quantity');

  const orderForm = document.getElementById('orderForm');
  const successMessage = document.getElementById('successMessage');

  const MIN_QTY = 1;
  const MAX_QTY = 99;

  // =====================================================
  // 1. PRODUCT IMAGE COLOR SWITCHING (PREVIEW SIDE)
  // =====================================================
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const newImage = swatch.getAttribute('data-image');
      const colorName = swatch.getAttribute('data-color');

      // Update product image instantly
      productImage.src = newImage;

      // Update active swatch styling
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Update label text
      selectedColorLabel.textContent = capitalize(colorName);

      // Sync the form's color radio buttons with the preview selection
      syncFormColorWithSwatch(colorName);
    });
  });

  // Sync preview swatch when the form's color radio is changed manually
  formColorRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const color = radio.value;
      const matchingSwatch = document.querySelector(`.swatch[data-color="${color}"]`);
      if (matchingSwatch) matchingSwatch.click();
    });
  });

  // Helper: keep form color radios in sync with swatch selection
  function syncFormColorWithSwatch(colorName) {
    formColorRadios.forEach(radio => {
      radio.checked = (radio.value === colorName);
    });
  }

  // Helper: capitalize first letter (e.g. "black" -> "Black")
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // =====================================================
  // 2. QUANTITY SELECTOR (+ / - BUTTONS)
  // =====================================================
  decreaseBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value, 10) || MIN_QTY;
    if (value > MIN_QTY) {
      quantityInput.value = value - 1;
    }
  });

  increaseBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value, 10) || MIN_QTY;
    if (value < MAX_QTY) {
      quantityInput.value = value + 1;
    }
  });

  // =====================================================
  // 3. FORM VALIDATION & SUBMISSION
  // =====================================================
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // --- Validate Full Name ---
    isValid = validateField('fullName', value => value.trim().length > 0) && isValid;

    // --- Validate Phone Number ---
    isValid = validateField('phone', value => {
      const cleaned = value.trim();
      // Basic check: at least 7 digits, allows +, spaces, dashes, parentheses
      const phonePattern = /^[+]?[\d\s\-().]{7,}$/;
      return cleaned.length > 0 && phonePattern.test(cleaned);
    }) && isValid;

    // --- Validate Address ---
    isValid = validateField('address', value => value.trim().length > 0) && isValid;

    // --- Validate Size Selection ---
    isValid = validateRadioGroup('size', 'sizeOptions', 'sizeError') && isValid;

    // If everything is valid, simulate a successful order submission
    if (isValid) {
      submitOrder();
    } else {
      // Scroll to the first invalid field for better UX
      const firstInvalid = document.querySelector('.form-group.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Helper: validate a standard text/textarea field
  function validateField(fieldId, validatorFn) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const value = field.value;

    if (validatorFn(value)) {
      formGroup.classList.remove('invalid');
      return true;
    } else {
      formGroup.classList.add('invalid');
      return false;
    }
  }

  // Helper: validate a radio button group (e.g. size selection)
  function validateRadioGroup(name, containerId, errorId) {
    const radios = document.getElementsByName(name);
    const formGroup = document.getElementById(containerId).closest('.form-group');
    const isChecked = Array.from(radios).some(radio => radio.checked);

    if (isChecked) {
      formGroup.classList.remove('invalid');
      return true;
    } else {
      formGroup.classList.add('invalid');
      return false;
    }
  }

  // =====================================================
  // 4. LIVE VALIDATION (clears error state as user types)
  // =====================================================
  ['fullName', 'phone', 'address'].forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('invalid');
    });
  });

  document.querySelectorAll('input[name="size"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('sizeOptions').closest('.form-group').classList.remove('invalid');
    });
  });

  // =====================================================
  // 5. SUBMIT ORDER (replace with real API call as needed)
  // =====================================================
  function submitOrder() {
    // Gather form data into an object - useful for sending to a backend API
    const orderData = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      size: document.querySelector('input[name="size"]:checked').value,
      color: document.querySelector('input[name="formColor"]:checked').value,
      quantity: parseInt(quantityInput.value, 10),
      notes: document.getElementById('notes').value.trim()
    };

    // TODO: Replace this with a real fetch() call to your backend/API
    // Example:
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });

    console.log('Order submitted:', orderData);

    // Show success message
    successMessage.classList.add('show');

    // Reset the form after a short delay
    setTimeout(() => {
      orderForm.reset();
      quantityInput.value = MIN_QTY;

      // Reset color preview to default (black)
      const blackSwatch = document.querySelector('.swatch[data-color="black"]');
      if (blackSwatch) blackSwatch.click();

      successMessage.classList.remove('show');
    }, 3000);
  }

});