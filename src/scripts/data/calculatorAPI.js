class CalculatorSource {
  static async getAllWastes() {
    const response = await fetch(`${process.env.BASE_URL}/wastes`);
    const responseJson = await response.json();

    return responseJson.wastes;
  }

  static async getAllActivities() {
    const response = await fetch(`${process.env.BASE_URL}/activities`);
    const responseJson = await response.json();

    return responseJson.wastes;
  }
}

export default CalculatorSource;
