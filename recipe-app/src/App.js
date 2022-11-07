import './App.css';
import RecipeList from './components/RecipeList';
import FormNewRecipe from './components/FormNewRecipe';
import {useEffect, useState} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL_API}/recipes`)
        .then((response) => response.json())
        .then((data) => {
          setRecipes(data)
          toast("All recipes fetched")
        });
  }, []);
  return (
    <div className="App">
      <FormNewRecipe recipes={recipes} setRecipes={setRecipes}/>
      <RecipeList recipes={recipes} setRecipes={setRecipes}/>
      <ToastContainer />
    </div>
  );
}

export default App;
