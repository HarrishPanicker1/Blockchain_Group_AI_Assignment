(async () => {
  if (!window.ethereum) {
    alert("MetaMask is required to use this dApp");
    return;
  }

  try {
    // Connect to MetaMask provider and request accounts
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // Load the contract JSON artifact dynamically
    const response = await fetch("./CompanyRegistry.json");
    if (!response.ok) {
      throw new Error("Failed to load CompanyRegistry.json");
    }
    const artifact = await response.json();

    // Create a ContractFactory for deployment
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

    // Deploy the contract dynamically
    console.log("Deploying contract...");
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("Contract deployed at:", contract.address);

    // Update UI
    const status = document.getElementById("status");
    if (status) {
      status.textContent = `Contract deployed at: ${contract.address}`;
      status.className = "success";
    }

    // Set up form submission to call addCompany on deployed contract
    const form = document.getElementById("companyForm");
    if (!form) {
      console.error("Form with id 'companyForm' not found");
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const type = form.type.value.trim();
      const location = form.location.value.trim();
      const description = form.description.value.trim();

      if (!name || !type || !location || !description) {
        alert("Please fill in all fields.");
        return;
      }

      // Validate location format (should be lat,lng)
      const locationParts = location.split(',');
      if (locationParts.length !== 2 || isNaN(locationParts[0]) || isNaN(locationParts[1])) {
        alert("Location must be in format: latitude,longitude (e.g., 3.1390,101.6869)");
        return;
      }

      try {
        status.textContent = "Sending transaction...";
        status.className = "";
        
        const tx = await contract.addCompany(name, type, location, description);
        status.textContent = "Transaction sent, waiting for confirmation...";
        
        await tx.wait();
        status.textContent = `Company added successfully! Transaction hash: ${tx.hash}`;
        status.className = "success";
        
        form.reset();
        
        // Redirect to main page after success
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 3000);
        
      } catch (error) {
        console.error(error);
        status.textContent = "Error: " + (error.data?.message || error.message);
        status.className = "error";
      }
    });

  } catch (error) {
    console.error("Initialization error:", error);
    const status = document.getElementById("status");
    if (status) {
      status.textContent = "Error initializing application: " + error.message;
      status.className = "error";
    }
  }
})();