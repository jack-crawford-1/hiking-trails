export const helloHome = async (req, res) => {
  try {
    const response = "Hello Home";
    res.json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const helloHello = async (req, res) => {
  try {
    const response = "Hello Hello";
    res.json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
