# Company Testimonials

Use this folder to manage the homepage `Customers We Serve` loop.

## Add a Company Logo

1. Put the logo file inside `company-testimonials/logos/`.
2. Use web-friendly formats such as `.png`, `.jpg`, `.webp`, or `.svg`.
3. Keep filenames simple, for example `parksons-packaging.png`.

## Add or Edit a Testimonial

Edit `testimonials.json`. Each entry can use this format:

```json
{
  "company": "Company Name",
  "logo": "/company-testimonials/logos/company-logo.png",
  "photo": "/company-testimonials/photos/person-photo.jpg",
  "quote": "What they have to say about Chemo Graphic International.",
  "person": "Person Name",
  "designation": "Designation at Company",
  "website": "https://company.example",
  "personUrl": "https://optional-link.example"
}
```

If `logo` is left empty, the website shows company initials instead.
If `photo` is present, it is shown only in the expanded testimonial view.
If `website` is left empty, the card shows `Website: To be added`.
