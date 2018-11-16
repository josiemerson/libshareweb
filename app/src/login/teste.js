// package br.com.libshare.repositories;

// /*
//  * Josiemerson.Lacerda
//  */

// import org.apache.log4j.Logger;
// import org.junit.Test;
// import org.springframework.beans.factory.annotation.Autowired;

// import br.com.libshare.book.BookEntity;
// import br.com.libshare.book.BookRepository;
// import br.com.libshare.utils.AbstractTest;

// public class BookTest extends AbstractTest {

// 	private static final Logger LOGGER = Logger.getLogger(BookTest.class);

// 	@Autowired
// 	private BookRepository bookRepository;

// 	@Test
// 	public void buscarPorNome() {
// 		BookEntity book = this.bookRepository.findByName("Quem mexeu no meu queijo");

// 		if (book != null && LOGGER.isInfoEnabled()) {
// 			LOGGER.info("Teste de sucesso. Buscar livro por nome: " + book);
// 		}else {
// 			LOGGER.error("Teste falhou");
// 		}
// 	}

// 	@Test
// 	public void BuscarPorAutor() {
// 		BookEntity book = this.bookRepository.findByAuthor("Paulo Coelho");

// 		if (LOGGER.isInfoEnabled()) {
// 			LOGGER.info("Teste findByAuthor sucesso.: Livro:" + book);
// 		}
// 	}

// 	@Test
// 	public void autorNaoEncontrado() {
// 		BookEntity book = this.bookRepository.findByAuthor("Paulo1");

// 		if(book == null) {
// 			LOGGER.error("Nenhum resultado encontrado.");
// 		}
// 	}

// 	@Test
// 	public void buscarPorId() {
// 		BookEntity book = this.bookRepository.getOne(1L);

// 		if (LOGGER.isInfoEnabled()) {
// 			LOGGER.info("Test getOne(Long) executado com sucesso. : " + book);
// 		}
// 	}

// }
