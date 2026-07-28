const menuButton=document.querySelector(".menu-button");
const mainNav=document.querySelector(".main-nav");
menuButton?.addEventListener("click",()=>{
  const open=mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll("[data-newsletter]").forEach(form=>{
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    const email=form.querySelector('input[type="email"]');
    const button=form.querySelector("button");
    const status=form.querySelector(".form-status");
    const originalLabel=button.textContent;
    if(!email.checkValidity()){email.reportValidity();return}
    button.disabled=true;button.textContent="Joining…";status.textContent="";
    try{
      const response=await fetch("https://api.knolyz.com/api/v1/crm/capture",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.value,source:"milegazette",tags:["newsletter"]})});
      if(!response.ok)throw new Error("capture failed");
      status.textContent="You’re on the list. Watch your inbox.";form.reset();
    }catch(error){status.textContent="We couldn’t add you right now. Please try again."}
    finally{button.disabled=false;button.textContent=originalLabel}
  });
});
document.querySelectorAll("[data-points-calculator]").forEach(form=>{
  const calculate=()=>{
    const cash=Number(form.elements.cash.value)||0;
    const fees=Number(form.elements.fees.value)||0;
    const points=Number(form.elements.points.value)||0;
    const value=points?((cash-fees)/points)*100:0;
    form.querySelector("[data-result]").textContent=`${value.toFixed(2)}¢ per point`;
  };
  form.addEventListener("input",calculate);calculate();
});
document.querySelectorAll("[data-fee-calculator]").forEach(form=>{
  const calculate=()=>{
    const cash=Number(form.elements.cash.value)||0;
    const fees=Number(form.elements.fees.value)||0;
    const other=Number(form.elements.other.value)||0;
    const total=fees+other;
    const ratio=cash?total/cash*100:0;
    form.querySelector("[data-result]").textContent=`$${total.toFixed(2)} (${ratio.toFixed(0)}% of cash fare)`;
  };
  form.addEventListener("input",calculate);calculate();
});
