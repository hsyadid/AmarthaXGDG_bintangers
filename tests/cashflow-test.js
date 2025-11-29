async function testCashflowAPI() {
  const endpoint = "http://localhost:3000/api/cashflow"; // sesuaikan path jika beda

  console.log("=== TEST MODE: LIST ===");

  const listResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "list",
      items: [
        { tipe: "expense", desc: "Makan", amount: 50000 },
        { tipe: "revenue", desc: "Gaji", amount: 5000000 }
      ]
    })
  });

  const listResult = await listResponse.json();
  console.log("LIST RESULT:", listResult);

  console.log("\n=== TEST MODE: TOTAL ===");

  const totalResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "total",
      total: {
        tipe: "expense",
        amount: 300000
      }
    })
  });

  const totalResult = await totalResponse.json();
  console.log("TOTAL RESULT:", totalResult);
}

testCashflowAPI();
