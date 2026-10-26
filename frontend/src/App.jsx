import { useState, useEffect } from 'react';
import furnitureService from './services/furnitureService';

const initialFormState = {
  furnituretype: '',
  rentalPeriod: '',
  monthlyrent: '',
  available: true,
};

function App() {
  const [rentals, setRentals] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const loadRentals = async () => {
    setLoading(true);
    try {
      const data = await furnitureService.getAllRentals();
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load rentals:', err);
      showMessage(
        err.response?.data?.message || err.message || 'Failed to fetch furniture rentals from server.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function initialFetch() {
      try {
        const data = await furnitureService.getAllRentals();
        if (!ignore) {
          setRentals(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load rentals:', err);
          showMessage(
            err.response?.data?.message || err.message || 'Failed to fetch furniture rentals from server.',
            'error'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.furnituretype.trim()) {
      showMessage('Furniture type is required.', 'error');
      return;
    }

    if (!formData.rentalPeriod.trim()) {
      showMessage('Rental period is required.', 'error');
      return;
    }

    const rentValue = parseFloat(formData.monthlyrent);
    if (isNaN(rentValue) || rentValue < 0) {
      showMessage('Monthly rent must be a valid positive number.', 'error');
      return;
    }

    const payload = {
      furnituretype: formData.furnituretype.trim(),
      rentalPeriod: formData.rentalPeriod.trim(),
      monthlyrent: rentValue,
      available: Boolean(formData.available),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await furnitureService.updateRental(editingId, payload);
        showMessage(`Furniture rental #${editingId} updated successfully!`, 'success');
        setEditingId(null);
      } else {
        await furnitureService.createRental(payload);
        showMessage('Furniture rental created successfully!', 'success');
      }
      setFormData(initialFormState);
      await loadRentals();
    } catch (err) {
      console.error('Failed to save rental:', err);
      showMessage(
        err.response?.data?.message || err.message || 'Operation failed. Please check backend connection.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rental) => {
    setEditingId(rental.id);
    setFormData({
      furnituretype: rental.furnituretype ?? '',
      rentalPeriod: rental.rentalPeriod ?? '',
      monthlyrent: rental.monthlyrent != null ? String(rental.monthlyrent) : '',
      available: Boolean(rental.available),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Are you sure you want to delete furniture rental #${id}?`);
    if (!confirmed) {
      return;
    }

    try {
      const responseMsg = await furnitureService.deleteRental(id);
      showMessage(typeof responseMsg === 'string' ? responseMsg : 'Rental deleted successfully!', 'success');
      if (editingId === id) {
        handleCancelEdit();
      }
      await loadRentals();
    } catch (err) {
      console.error('Failed to delete rental:', err);
      showMessage(
        err.response?.data?.message || err.message || 'Failed to delete rental.',
        'error'
      );
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Furniture Rental Management</h1>
        <p>Spring Boot REST API + React Client</p>
      </header>

      {message && (
        <div id="alert-message" className={`alert-banner ${message.type}`}>
          <span>{message.text}</span>
          <button
            id="btn-dismiss-alert"
            type="button"
            className="alert-close"
            onClick={clearMessage}
            aria-label="Dismiss alert"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form Section */}
      <section className="card">
        <h2 className="card-title">
          <span>{editingId ? `Edit Furniture Rental (#${editingId})` : 'Add New Furniture Rental'}</span>
          {editingId && <span className="card-subtitle">Updating existing record</span>}
        </h2>

        <form id="rental-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="input-furnituretype">Furniture Type *</label>
              <input
                id="input-furnituretype"
                name="furnituretype"
                type="text"
                className="form-control"
                placeholder="e.g. Sofa, Dining Table, Bed"
                value={formData.furnituretype}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-rentalPeriod">Rental Period *</label>
              <input
                id="input-rentalPeriod"
                name="rentalPeriod"
                type="text"
                className="form-control"
                placeholder="e.g. 3 Months, 6 Months, 1 Year"
                value={formData.rentalPeriod}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-monthlyrent">Monthly Rent ($) *</label>
              <input
                id="input-monthlyrent"
                name="monthlyrent"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="e.g. 45.00"
                value={formData.monthlyrent}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label" htmlFor="input-available">
                  <input
                    id="input-available"
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleInputChange}
                  />
                  <span>Available for rent</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              id="btn-submit-rental"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? 'Processing...'
                : editingId
                ? 'Update Rental'
                : 'Create Rental'}
            </button>
            {editingId && (
              <button
                id="btn-cancel-edit"
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="card">
        <div className="card-title">
          <span>Existing Furniture Rentals</span>
          <button
            id="btn-refresh-rentals"
            type="button"
            className="btn btn-secondary"
            onClick={loadRentals}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        {loading && rentals.length === 0 ? (
          <div className="state-message">Loading furniture rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="state-message">No furniture rentals found. Use the form above to add a record.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Furniture Type</th>
                  <th>Rental Period</th>
                  <th>Monthly Rent</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td><strong>#{rental.id}</strong></td>
                    <td>{rental.furnituretype}</td>
                    <td>{rental.rentalPeriod}</td>
                    <td>${Number(rental.monthlyrent).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          rental.available ? 'badge-available' : 'badge-unavailable'
                        }`}
                      >
                        {rental.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          id={`btn-edit-${rental.id}`}
                          type="button"
                          className="btn btn-edit"
                          onClick={() => handleEdit(rental)}
                        >
                          Edit
                        </button>
                        <button
                          id={`btn-delete-${rental.id}`}
                          type="button"
                          className="btn btn-delete"
                          onClick={() => handleDelete(rental.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
