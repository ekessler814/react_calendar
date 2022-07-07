import { render, screen, act } from "@testing-library/react";
import  Calendar   from "./App";

beforeEach(() => {
  jest.resetAllMocks()
});

async function mockFetch(url) {
  const mockData = {
    provinces: [{
      holidays: [{id: 1}],
      id: 'AB',
      nameEn: 'Alberta'
    }],
  }
 switch (url) {
     case "https://canada-holidays.ca/api/v1/provinces": {
         return {
             ok: true,
             status: 200,
             json: async () => mockData,
         };
     }
     default: {
         throw new Error(`Unhandled request: ${url}`);
     }
 }
}

it("Check if error appears in event of API error", async () => {

  jest.spyOn(window, "fetch").mockRejectedValue(null);

  await act(async () => {
    render(<Calendar />);
  })

   expect(await screen.findByText('Error...')).toBeInTheDocument()

})

it("Check if Calendar rendered on success", async () => {

jest.spyOn(window, "fetch").mockImplementation(mockFetch);
  await act(async () => {

    render(<Calendar />);
  })
  // fetch.mockResponseOnce(JSON.stringify());
  // expect(screen.getByText('Loading...')).toBeInTheDocument()
   expect(await screen.findByText('Calendar App')).toBeInTheDocument()

  // await waitFor(() => {
  //     expect(screen.getByText('Loading...')).toBeInTheDocument()
  // })

})
