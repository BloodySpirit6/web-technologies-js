console.log("Завдання 1: ");
let fruits = ["яблуко", "банан", "апельсин", "виноград"]
console.log("Масив: ", fruits);
fruits.pop();
console.log("1.1 Оновлений масив: ", fruits);
fruits.unshift("ананас")
console.log("1.2 Масив після додавання ананаса: ", fruits);
fruits.sort().reverse();
console.log("1.3 Відсортований масив: ", fruits);
let appleIndex = fruits.indexOf("яблуко");
console.log("Індекс яблука:" , appleIndex);


console.log("Завдання 2: ");
let colors = ["червоний", "синій", "зелений", "жовтий", "фіолетовий", "блакитний", "темно-синій"];
console.log("2.1 Масив: ", colors);
let longest = colors.reduce((a, b) => (a.length > b.length ? a : b));
let shortest = colors.reduce((a, b) => (a.length < b.length ? a : b));
console.log("2.2 Найдовший колір: ", longest, "Найкоротший колір: ", shortest);
colors = colors.filter(color => color.includes("синій"));
console.log("2.3 Масив після фільтрації: ", colors);
let colorString = colors.join(", ");
console.log("2.4 Результат: ", colorString);


console.log("Завдання 3: ");
let employees = [
    { name: "Олександр", age: 30, position: "розробник" },
    { name: "Марія", age: 25, position: "дизайнер" },
    { name: "Іван", age: 35, position: "тестувальник" },
    { name: "Анна", age: 28, position: "розробник" },
    { name: "Петро", age: 40, position: "менеджер" }
];
employees.sort((a, b) => a.name.localeCompare(b.name));
console.log("3.1 Відсортований масив за іменами: ", employees);
let developers = employees.filter(emp => emp.position === "розробник");
console.log("3.2 Розробники: ", developers);
employees = employees.filter(emp => emp.age <= 35);
console.log("3.3 Масив після видалення працівників старших за 35 років: ", employees);
employees.push({ name: "Василь", age: 27, position: "аналітик" });
console.log("3.4 Оновлений масив: ", employees);


console.log("Завдання 4: ");
let students = [
    { name: "Олексій", age: 22, course: 2 },
    { name: "Марина", age: 20, course: 1 },
    { name: "Іван", age: 23, course: 3 },
    { name: "Андрій", age: 21, course: 2 },
    { name: "Софія", age: 24, course: 4 }
];
console.log("4.1 Масив студентів: ", students);
tudents = students.filter(student => student.name !== "Олексій");
console.log("4.2 Масив після видалення Олексія: ", students);
students.push({ name: "Дмитро", age: 19, course: 1 });
console.log("4.3 Оновлений масив студентів: ", students);
students.sort((a, b) => b.age - a.age);
console.log("4.4 Студенти після сортування за віком: ", students);
let thirdCourseStudent = students.find(student => student.course === 3);
console.log("4.5 Студент 3-го курсу: ", thirdCourseStudent);


console.log("Завдання 5: ");
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let squaredNumbers = numbers.map(num => num ** 2);
console.log("5.1 Числа у квадраті: ", squaredNumbers);
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log("5.2 Парні числа: ", evenNumbers);
let sum = numbers.reduce((acc, num) => acc + num);
console.log("5.3 Сума чисел: ", sum);
let extraNumbers = [11, 12, 13, 14, 15];
numbers = numbers.concat(extraNumbers);
console.log("5.4 Оновлений масив: ", numbers);
numbers.splice(0, 3);
console.log("5.5 Масив після видалення перших 3 елементів:", numbers);


console.log("Завдання 6: ");
function libraryManagement() {
    let books = [
        { title: "Гаррі Поттер", author: "Дж. К. Роулінг", genre: "Фентезі", pages: 400, isAvailable: true },
        { title: "1984", author: "Джордж Оруелл", genre: "Антиутопія", pages: 328, isAvailable: false },
        { title: "Майстер і Маргарита", author: "Михайло Булгаков", genre: "Роман", pages: 500, isAvailable: true }
    ];
    return {
        addBook(title, author, genre, pages) {
            books.push({ title, author, genre, pages, isAvailable: true });
            console.log(`Книга "${title}" додана до бібліотеки.`);
        },
        removeBook(title) {
            books = books.filter(book => book.title !== title);
            console.log(`Книга "${title}" була видалена з бібліотеки.`);
        },
        findBooksByAuthor(author) {
            let foundBooks = books.filter(book => book.author === author);
            console.log(`Знайдені книги автора "${author}":`, foundBooks);
            return foundBooks;
        },
        toggleBookAvailability(title, isBorrowed) {
            let book = books.find(book => book.title === title);
            if (book) {
                book.isAvailable = !isBorrowed;
                console.log(`Книга "${title}" тепер ${book.isAvailable ? "доступна" : "взята"}.`);
            }
        },
        sortBooksByPages() {
            books.sort((a, b) => a.pages - b.pages);
            console.log("Книги відсортовані за кількістю сторінок:", books);
        },
        getBooksStatistics() {
            let totalBooks = books.length;
            let availableBooks = books.filter(book => book.isAvailable).length;
            let borrowedBooks = totalBooks - availableBooks;
            let avgPages = totalBooks ? books.reduce((sum, book) => sum + book.pages, 0) / totalBooks : 0;

            let stats = { totalBooks, availableBooks, borrowedBooks, avgPages };
            console.log("Статистика бібліотеки:", stats);
            return stats;
        },
        getBooks() {
            console.log("Поточний список книг:", books);
            return books;
        }
    };
}
const library = libraryManagement();
library.addBook("Дюна", "Френк Герберт", "Фантастика", 600);
library.removeBook("1984");
library.findBooksByAuthor("Френк Герберт");
library.toggleBookAvailability("Гаррі Поттер", true);
library.sortBooksByPages();
library.getBooks();
library.getBooksStatistics();


console.log("Завдання 7: ");
let student = {
    name: "Олександр",
    age: 19,
    course: 2
};
console.log("Об'єкт студента: ", student);
student.subjects = ["Математика", "Фізика", "Програмування"];
delete student.age;
console.log("Оновлений об'єкт студента: ", student);




