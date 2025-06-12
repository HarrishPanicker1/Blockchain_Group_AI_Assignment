(async () => {
  if (!window.ethereum) {
    alert("MetaMask is required to use this dApp");
    return;
  }

  // Connect to MetaMask provider and request accounts
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  // Load the contract JSON artifact dynamically
  const response = await fetch("./CompanyRegistry.json");
  if (!response.ok) {
    alert("Failed to load CompanyRegistry.json");
    return;
  }
  const artifact = await response.json();

  // Create a ContractFactory for deployment
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

  // Deploy the contract dynamically
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("Contract deployed at:", contract.address);

  // Update UI or store contract address as needed
  const status = document.getElementById("status");
  if (status) status.textContent = `Contract deployed at: ${contract.address}`;

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

    try {
      status.textContent = "Sending transaction...";
      const tx = await contract.addCompany(name, type, location, description);
      await tx.wait();
      status.textContent = `Company added! Transaction hash: ${tx.hash}`;
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = "Error: " + (error.data?.message || error.message);
    }
  });
})();
