/* eslint-disable jsx-a11y/accessible-emoji */
import { useState } from 'react';
import cn from 'classnames';

import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import usersFromServer from './api/users';

import { ProductsTable } from './components/ProductsTable';

import './App.scss';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    currentCategory => currentCategory.id === product.categoryId,
  );
  const user = usersFromServer.find(
    currentUser => currentUser.id === category.ownerId,
  );

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleChangeUser = id => {
    setActiveUser(id);
  };

  const filterProducts = products.filter(product => {
    const matchesUser = activeUser === 0 || product.user.id === activeUser;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category.id);

    return matchesUser && matchesSearch && matchesCategory;
  });

  const handleInputChange = event => {
    setSearchValue(event.target.value);
  };

  const handleClearInput = () => {
    setSearchValue('');
  };

  const handleCategoryClick = categoryId => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId],
    );
  };

  const handleResetFilters = () => {
    setActiveUser(0);
    setSearchValue('');
    setSelectedCategories([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': activeUser === 0,
                })}
                onClick={() => handleChangeUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({
                    'is-active': activeUser === user.id,
                  })}
                  onClick={() => handleChangeUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleInputChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {searchValue && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearInput}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategories.length,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filterProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <ProductsTable filteredProducts={filterProducts} />
          )}
        </div>
      </div>
    </div>
  );
};
