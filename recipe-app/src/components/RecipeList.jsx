import { toast } from "react-toastify";
import { useState } from "react";

const RecipeList = ({recipes, setRecipes}) => {
    const [credentials, setCredentials] = useState({})

    function handleDelete(id) {
        const confirm = window.confirm("Are you sure you want to delete this recipe?");
        if (confirm) {
            fetch(`${process.env.REACT_APP_URL_API}/recipes/${id}`, {
                method: "DELETE",
            }).then(() => {
                setRecipes(recipes.filter((recipe) => recipe.id !== id));
                toast("Recipe deleted", {type: "success"});
            });
        }else{
            toast("Recipe not deleted", {type: "error"});
        }
    }
    function handleUpdate(e, idDb, idArray){
        e.preventDefault();
        fetch(`${process.env.REACT_APP_URL_API}/recipes/${idDb}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: credentials.title,
            }),
        }).then(() => {
            recipes[idArray].title = credentials.title;
            setRecipes([...recipes]);
            toast("Recipe updated", {type: "success"});
        })
    }

    const handleChange = (event) => {
        const {value, name} = event.target;

        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    return ( 
        <ul className="recipe-list">
            { recipes.map((recipe, id) => {
                return <li key={recipe.id}>
                        {recipe.title}
                        <form onSubmit={(e) => {handleUpdate(e, recipe.id, id)}}>
                            <input type="text" name="title" className={`input-title-${recipe.id}`} defaultValue={recipe.title} onInput={(e) => handleChange(e)}/>
                            <button type="submit">Update</button>
                        </form>
                        <button onClick={() => {handleDelete(recipe.id)}}>Delete</button></li>
            })}
        </ul>
    );
}
 
export default RecipeList;