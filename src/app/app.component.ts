import { HttpClient, HttpParams } from '@angular/common/http';

import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { AuthenticationService } from './authentication.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';


interface Genre {
  genre: string,
  id: number

};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, AfterContentChecked{
  constructor(private httpClient: HttpClient,  private changeDetector: ChangeDetectorRef, private authService: AuthenticationService) { }
  isLoginMode = true;
  selectedFile!: File;
  retrievedResponse: any;
  
  bookTitle: string = "";  
  filterMetadata = { count: -1 };
 
  genres: Genre[] = [];
  selectedGenre: string = "";
  sortBy: string = "";

  dropdownVisible: boolean = false;
  modalOpen: boolean = false;
  bookId: number = 0;
  bookForm!: FormGroup;
  authForm!: FormGroup;

  activeGenreButton: number = 0;
  pagesTotal: number = 0;
  currentPage: number = 1;
  showPagination: boolean = true;
  chosenCategory: string = "";

  loading: boolean = false; 
  isUserLoggedIn: boolean = false;
  currentUser: any;
  userExists: boolean = false;


  ngOnInit() {
    this.userStatus();
    this.loading = true;
   
    if (this.isUserLoggedIn) {
      this.getAllGenres();
      this.getAllBooks();
         this.currentUser = sessionStorage.getItem("username");
    }
   
    this.resetForm();
    this.resetAuthForm();
  
    
  }

  // prevents the error NG0100: ExpressionChangedAfterItHasBeenCheckedError when changing the page
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

   userStatus() {
    let user = sessionStorage.getItem("username");
    this.isUserLoggedIn = !(user === null);
  }

  getAllBooks() {
    this.loading = true;
     const params = new HttpParams()
        .set('pageNo', this.currentPage -1)
        .set('pageSize', 6)
        .set("sortBy", this.sortBy)
    
    this.httpClient.get<any>('http://localhost:8080/book/getAllBooks', { params })
      .subscribe(
        response => {
          this.getAPIResponseAndImage(response);
        }
    );

  }

  getAllGenres() {
     this.httpClient.get<Genre[]>('http://localhost:8080/genre/getAllGenres').subscribe(
      (response) => {
        if (response) this.loading = false;
        
        this.genres = response.sort((a, b) =>
          a.genre.localeCompare(b.genre));
      });
  }

 
  getFilteredBooks() {  
    this.loading = true;
    const params = new HttpParams()
      .set('pageNo', this.currentPage -1)
      .set('pageSize', 6)
      .set("sortBy", this.sortBy)
      .set("bookTitle", this.bookTitle)
    
    if (this.bookTitle.trim() !== "") {
      this.httpClient.get<any>('http://localhost:8080/book/getFilteredBooks', {params})
      .subscribe(
        response => {
          this.getAPIResponseAndImage(response);
        });
    } else {
        this.getAllBooks();
    }
    
  }

  getByGenre(genre: string, index: number) {
    const params = new HttpParams()
      .set('pageNo', this.currentPage - 1)
      .set('pageSize', 6)
      .set("sortBy", this.sortBy);
    
    this.httpClient.get<any>('http://localhost:8080/book/getByGenre/' + genre, {params})
      .subscribe(
        response => {
          
          this.getAPIResponseAndImage(response);
        });
    
    this.activeGenreButton = index;
    this.chosenCategory = genre;
  }


  showAllGenres() {
    this.sortBy = "";
    this.getAllBooks();
    this.activeGenreButton = 0;
    
    this.showPagination = true;
  }

  selectedSortBy(event: any) {
    this.sortBy = event.target.value;
   
    if (this.bookTitle) this.getFilteredBooks();
    if (this.activeGenreButton != 0) this.getByGenre(this.chosenCategory, this.activeGenreButton);
    else this.getAllBooks();
  }
 
  genreChosen(genre: string) {
    this.selectedGenre = genre;
    this.dropdownVisible = false;
  }

  public onFileChanged(event: any) {
    //Select File
    this.selectedFile = event.target.files[0];
     
  }

  openUpdateBookModal(id: number) {
    this.modalOpen = true;
    this.bookId = id;

    this.httpClient.get<any>('http://localhost:8080/book/getById/' + id)
      .subscribe(
        res => {

        //  this.bookForm.patchValue fills out the inputs in the update book modal 
          this.bookForm.patchValue({
              bookTitle: res[0].name,
              author: res[0].author,
              year: res[0].year,
              description: res[0].description
          });

          this.selectedGenre = res[1];
        
        });

  }
  
   onDelete(id: number) {
   
    //Make a call to the Spring Boot Application to delete the book
    this.httpClient.delete('http://localhost:8080/book/delete/' + id, {  observe: "response" })
      .subscribe((response: any) => {
    
        if(this.activeGenreButton != 0) this.getByGenre(this.chosenCategory, this.activeGenreButton);
        else this.getAllBooks();
      
      }
    );
   }
  

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
     this.getAllBooks();
  }

   toggleModal() {
     this.modalOpen = !this.modalOpen;
     this.resetForm();
   }
 
  onSubmit() {
    if (this.bookId != 0) this.onCreateOrUpdateBook("put", this.bookId);
    else this.onCreateOrUpdateBook("post", 0);
    
    this.resetForm();
    this.bookId = 0;
    this.selectedGenre = "";
    this.toggleModal();
    
  }

  login(username: string, password: string) {
    
    this.authService.login(username, password).subscribe((response: any) => {
      sessionStorage.setItem("username", username);
      this.currentUser = username;
      let tokenStr = response.headers.get('Authorization');
      sessionStorage.setItem("token", tokenStr);
    
      this.userStatus();
      this.resetAuthForm();
      this.getAllBooks();
      this.getAllGenres();
          
    });
  }

  onAuthSubmit() {
    const { username, password } = this.authForm.value;
    
    if (this.isLoginMode) {
      this.login(username, password);
    } else {
      const body = { username: username, password: password };
      this.httpClient.post("http://localhost:8080/users/signup", body, {  observe: 'response' })
          .subscribe(response => {
            this.login(username, password);
           
          }, error => {
           
            this.userExists = true;
          } ); 
    
     this.userExists = false;
      this.resetAuthForm();
    }
   
  }

  logOut() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");

    this.userStatus();
    this.activeGenreButton = 0;
    this.chosenCategory = "";
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

   resetForm() {
       this.bookForm = new FormGroup({
      'bookTitle': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required]),
      'year': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required]),
      'bookCover': new FormControl(null, [Validators.required])
   
      })
   }
  
  resetAuthForm() {
    this.authForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    })
  }
  
  getAPIResponseAndImage(response: any) {
    if (response) this.loading = false;

    if (response.totalPages < 2) this.showPagination = false;
    this.pagesTotal = response.totalPages;
    
    this.retrievedResponse = response.content;
    this.retrievedResponse.map((el: any) => {
          
        if (el.imageType == "image/jpeg") {
            el.image = 'data:image/jpeg;base64,' + el.picByte;
          } else if (el.imageType == "image/png") {
            el.image = 'data:image/png;base64,' + el.picByte;
          } else if (el.imageType == "image/jpg") {
            el.image = 'data:image/jpg;base64,' + el.picByte;
          }
        })
  }

     //Gets called when the user clicks on submit to create a book
  onCreateOrUpdateBook(action: string, id: number) {
    
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    
    const book = { name: this.bookForm.value.bookTitle, author: this.bookForm.value.author, year: this.bookForm.value.year, description: this.bookForm.value.description };
    
    uploadImageData.append('bookFile', this.selectedFile);
    uploadImageData.append('genre', this.selectedGenre);
    uploadImageData.append('book', JSON.stringify( book ));
    
    //Make a call to the Spring Boot Application to save/update the book info 
    if (action === "post") {
       this.httpClient.post("http://localhost:8080/book/upload", uploadImageData, {  observe: "response" })
        .subscribe((response: any) => {
      
          this.loadBookListAfterSubmit(response); 
      }); 
    }

    if (action === "put" && id !== 0) {
      this.httpClient.put('http://localhost:8080/book/update/' + id, uploadImageData, {  observe: "response" })
      .subscribe((response: any) => {
      
          this.loadBookListAfterSubmit(response); 
      }
    );
    }
   
  }

  loadBookListAfterSubmit(response: any) {
    if (response.status === 200 && this.activeGenreButton != 0) this.getByGenre(this.chosenCategory, this.activeGenreButton);
    if(response.status === 200 && this.activeGenreButton === 0) this.getAllBooks();
  }
}