import { Nav } from '../components/layout/Nav';
import type { Category } from '../types/models';
import { createCategory, getCategories } from '../api/categories';
import { useEffect, useState } from 'react';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  async function handleAddCategory() {
    const trimmedCategory = newCategory.trim()

    if (!trimmedCategory) {
      return;
    }

    const createdCategory = await createCategory(trimmedCategory);

    setCategories([...categories, createdCategory]);
    setNewCategory('');
  }

  return (
    <div>
      <Nav />

      <div style={{ padding: 'var(--space-8)' }}>
        <h1>Categories</h1>
        <input
        type="text"
        value={newCategory}
        onChange={(event) => setNewCategory(event.target.value)}
        />
      <button onClick={handleAddCategory}>
      Add Category
      </button>
        

        {categories.map((category) => (
          <p key={category.id}>{category.name}</p>
        ))}

      </div>
    </div>
  );
}
