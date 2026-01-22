(async()=>{
  try{
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'admin', password: 'ChangeMe123!' })
    });
    const ct = res.headers.get('content-type') || '';
    console.log('STATUS', res.status, 'CT', ct);
    const text = await res.text();
    console.log('BODY START\n', text.slice(0,800));
  }catch(e){
    console.error('ERR', e.message);
  }
})();
