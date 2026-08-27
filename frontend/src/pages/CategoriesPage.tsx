import { Nav } from '../components/layout/Nav';
import type { Category } from '../types/models';
import { createCategory, deleteCategory, getCategories } from '../api/categories';
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

  async function handleDeleteCategory(id: number) {
    await deleteCategory(id);

    setCategories(
      categories.filter((category)=> category.id !==id)
    );
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
        
        {categories.map((category) => 
          <div key={category.id}>
            <p>{category.name}</p>

            <button onClick={()=> handleDeleteCategory(category.id)}>
              Delete
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
