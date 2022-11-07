import { useState } from "react";
const FormNewRecipe = ({recipes, setRecipes}) => {

    const [credentials, setCredentials] = useState({})

    const handleChange = (event) => {
        const {value, name} = event.target;

        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch(`${process.env.REACT_APP_URL_API}/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => response.json())
            .then((recipe) => {
                setRecipes([...recipes,recipe[0]])
            })
    }
    return ( 
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="title"  onChange={(e) => {handleChange(e)}}/>
            <input type="text" name="category" placeholder="category" onChange={(e) => {handleChange(e)}}/>
            <input type="submit" value="New recipe" />
        </form>
     );
}
 
export default FormNewRecipe;