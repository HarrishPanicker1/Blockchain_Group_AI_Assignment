window.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("status");

  if (!window.ethereum) {
    alert("MetaMask is required to use this dApp");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const response = await fetch("CompanyRegistry.json");
    if (!response.ok) {
      alert("Failed to load CompanyRegistry.json");
      return;
    }

    const artifact = await response.json();

    // ✅ Deploy a new instance of the contract
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const contract = await factory.deploy();
    await contract.deployed();

    console.log("✅ Deployed new contract at:", contract.address);
    if (status) status.textContent = `Deployed new contract at: ${contract.address}`;

    const form = document.getElementById("companyForm");
    if (!form) {
      console.error("Form with id 'companyForm' not found");
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const type = form.type.value.trim();
      const location = `${form.longitude.value.trim()},${form.latitude.value.trim()}`;
      const description = form.description.value.trim();
      const popupText = `Company name : ${name}, industry type: ${type}`;

      if (typeof circleMarker !== "undefined") {
        circleMarker.bindPopup(popupText);
      }

      if (!name || !type || !location || !description) {
        alert("All fields are required.");
        return;
      }

      try {
        status.textContent = "Sending transaction...";
        const tx = await contract.addCompany(name, type, location, description);
        await tx.wait();
        status.textContent = `✅ Company added! Tx: ${tx.hash}`;

        // Get lat/lng values
        const lat = parseFloat(document.getElementById("latitude").value);
        const lng = parseFloat(document.getElementById("longitude").value);

        // Save marker data to localStorage
        localStorage.setItem("newCompanyMarker", JSON.stringify({
          lat,
          lng,
          name,
          type
        }));

        // Reset form
        form.reset();

        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (err) {
        console.error(err);
        status.textContent = `❌ Error: ${err.reason || err.message}`;
      }
    });

  } catch (error) {
    console.error("Init error:", error);
    alert("Initialization error. See console.");
  }
});
