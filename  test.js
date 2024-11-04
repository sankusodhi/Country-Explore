// Example test cases using Mocha and Chai
describe('Country Explorer', () => {
    it('should fetch countries from API', async () => {
        const countries = await fetchCountries();
        expect(countries).to.be.an('array');
    });

    it('should render countries correctly', () => {
        const countries = [{ name: { common: 'Canada' }, flags: { png: 'flag_url' } }];
        renderCountries(countries);
        const countryCards = document.querySelectorAll('.country-card');
        expect(countryCards.length).to.equal(1);
    });

    // Add more tests as necessary
});
