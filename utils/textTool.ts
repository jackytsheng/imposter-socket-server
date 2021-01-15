

export const cap = (name:string) : string =>{
  try{
    if(name){
    let nameArray : string[] = name.split(" ");
    nameArray = nameArray.map(nameFragment => {
      nameFragment.trim();
      return nameFragment[0].toUpperCase() + nameFragment.slice(1);

    })
    return nameArray.join(" ");
  }
    else{
      return ""
    }
  
  }catch(e){
    console.error(e);
    return " "
  }
}

